import type { TransformationMatrix } from '../transform/transformation-matrix'
import type { Line } from './line'
import type { Rectangle } from './rectangle'
import type { CurveOps } from './union/curve-ops'
import type { XY } from './xy'
import type { JsonObject } from '@/graph/core/models/json-value'
import { applyMatrix, isXY } from './xy'

export type LineOps = CurveOps<Line> & {

}

export const lineOps: LineOps = {
  guard(object: JsonObject): object is Line {
    return (
      typeof object === 'object'
      && object !== null
      && 'start' in object
      && 'end' in object
      && typeof object.start === 'object'
      && typeof object.end === 'object'
      && isXY(object.start)
      && isXY(object.end)
    )
  },

  cast(object: JsonObject): Line {
    if (this.guard(object)) {
      return {
        start: { ...object.start },
        end: { ...object.end },
      }
    }
    throw new Error('This object could not be cast to a line shape.')
  },

  /**
   * Linear interpolation between start and end.
   * t ∈ [0,1]
   */
  pointAt(shape: Line, t: number, m?: TransformationMatrix): XY {
    if (t < 0 || t > 1) {
      throw new Error(`LineOps.pointAt: parameter t=${t} is outside [0,1].`)
    }

    const { start, end } = shape

    const p: XY = {
      x: start.x + (end.x - start.x) * t,
      y: start.y + (end.y - start.y) * t,
    }

    return m ? applyMatrix(p, m) : p
  },

  /**
   * Euclidean distance between start and end.
   * If a transform is present:
   *   - uniform scale is supported
   *   - non-uniform scale or shear is rejected (length becomes ambiguous)
   */
  length(shape: Line, m?: TransformationMatrix): number {
    const { start, end } = shape

    const dx = end.x - start.x
    const dy = end.y - start.y
    const baseLength = Math.hypot(dx, dy)

    if (!m)
      return baseLength

    // Extract scale from matrix
    const sx = Math.hypot(m.a, m.b)
    const sy = Math.hypot(m.c, m.d)

    // Reject non-uniform scaling or shear
    if (Math.abs(sx - sy) > 1e-9) {
      throw new Error(
        'LineOps.length: non-uniform scaling or shear makes line length undefined.',
      )
    }

    return baseLength * sx
  },

  /**
   * Axis-aligned bounding box of the transformed endpoints.
   */
  boundingBox(shape: Line, m?: TransformationMatrix): Rectangle {
    const { start, end } = shape

    const p0 = m ? applyMatrix(start, m) : start
    const p1 = m ? applyMatrix(end, m) : end

    const minX = Math.min(p0.x, p1.x)
    const minY = Math.min(p0.y, p1.y)
    const maxX = Math.max(p0.x, p1.x)
    const maxY = Math.max(p0.y, p1.y)

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    }
  },
}
