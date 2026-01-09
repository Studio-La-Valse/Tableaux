import type { Line } from './line'
import type { Rectangle } from './rectangle'
import type { CurveOps } from './union/curve-ops'
import type { DrawableOps } from './union/drawable/drawable-ops'
import type { XY } from './xy'
import type { JsonObject } from '@/graph/core/models/json-value'
import { drawShape } from '@/bitmap-painters/bitmap-painter'
import { xyOps } from './xy-ops'

export type LineOps = CurveOps<Line> & DrawableOps<Line> & {

}

export const lineOps: LineOps = {
  match(object: JsonObject): object is Line {
    return (
      typeof object === 'object'
      && object !== null
      && 'start' in object
      && 'end' in object
      && typeof object.start === 'object'
      && typeof object.end === 'object'
      && xyOps.match(object.start)
      && xyOps.match(object.end)
    )
  },

  cast(object: JsonObject): Line {
    if (this.match(object)) {
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
  pointAt(shape: Line, t: number): XY {
    if (t < 0 || t > 1) {
      throw new Error(`LineOps.pointAt: parameter t=${t} is outside [0,1].`)
    }

    const { start, end } = shape

    const p: XY = {
      x: start.x + (end.x - start.x) * t,
      y: start.y + (end.y - start.y) * t,
    }

    return p
  },

  /**
   * Euclidean distance between start and end.
   * If a transform is present:
   *   - uniform scale is supported
   *   - non-uniform scale or shear is rejected (length becomes ambiguous)
   */
  length(shape: Line): number {
    const { start, end } = shape

    const dx = end.x - start.x
    const dy = end.y - start.y
    const baseLength = Math.hypot(dx, dy)

    return baseLength
  },

  /**
   * Axis-aligned bounding box of the transformed endpoints.
   */
  boundingBox(shape: Line): Rectangle {
    const { start, end } = shape

    const p0 = start
    const p1 = end

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

  draw(ctx: CanvasRenderingContext2D, element: Line) {
    drawShape(ctx, element, () => {
      const { start, end } = element
      ctx.moveTo(start.x, start.y)
      ctx.lineTo(end.x, end.y)
    })
  },
}
