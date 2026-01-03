import type { TransformationMatrix } from '../transform/transformation-matrix'
import type { Rectangle } from './rectangle'
import type { CurveOps } from './union/curve-ops'
import type { SurfaceOps } from './union/surface-ops'
import type { XY } from './xy'
import type { JsonObject } from '@/graph/core/models/json-value'
import { applyMatrix } from './xy'

export type RectangleOps = CurveOps<Rectangle> & SurfaceOps<Rectangle> & {

}

export const rectangleOps: RectangleOps = {
  guard(object: JsonObject): object is Rectangle {
    return (
      typeof object === 'object'
      && object !== null
      && typeof object.x === 'number'
      && typeof object.y === 'number'
      && typeof object.width === 'number'
      && typeof object.height === 'number'
    )
  },

  cast(object: JsonObject): Rectangle {
    if (this.guard(object)) {
      return { ...object }
    }
    throw new Error('This object could not be cast to a rectangle shape.')
  },

  /**
   * Parameter t ∈ [0,1] walks the perimeter clockwise starting at (x, y).
   */
  pointAt(rect: Rectangle, t: number, m?: TransformationMatrix): XY {
    if (t < 0 || t > 1) {
      throw new Error(`RectangleOps.pointAt: parameter t=${t} is outside [0,1].`)
    }

    const { x, y, width, height } = rect

    if (width < 0 || height < 0) {
      throw new Error('RectangleOps.pointAt: width and height must be non-negative.')
    }

    const p = width * 2 + height * 2
    if (p === 0) {
      // Degenerate rectangle → single point
      const pt = { x, y }
      return m ? applyMatrix(pt, m) : pt
    }

    let d = t * p

    // Walk edges clockwise
    if (d <= width) {
      const pt = { x: x + d, y }
      return m ? applyMatrix(pt, m) : pt
    }
    d -= width

    if (d <= height) {
      const pt = { x: x + width, y: y + d }
      return m ? applyMatrix(pt, m) : pt
    }
    d -= height

    if (d <= width) {
      const pt = { x: x + width - d, y: y + height }
      return m ? applyMatrix(pt, m) : pt
    }
    d -= width

    // Last edge
    const pt = { x, y: y + height - d }
    return m ? applyMatrix(pt, m) : pt
  },

  /**
   * Perimeter length.
   * Transform rules:
   *   - uniform scale supported
   *   - non-uniform scale or shear rejected
   */
  length(rect: Rectangle, m?: TransformationMatrix): number {
    const { width, height } = rect

    if (width < 0 || height < 0) {
      throw new Error('RectangleOps.length: width and height must be non-negative.')
    }

    const base = 2 * (width + height)

    if (!m)
      return base

    const sx = Math.hypot(m.a, m.b)
    const sy = Math.hypot(m.c, m.d)

    if (Math.abs(sx - sy) > 1e-9) {
      throw new Error(
        'RectangleOps.length: non-uniform scaling or shear makes perimeter undefined.',
      )
    }

    return base * sx
  },

  /**
   * AABB of the transformed rectangle.
   * If no transform: trivial.
   * If transform: transform all 4 corners and compute AABB.
   */
  boundingBox(rect: Rectangle, m?: TransformationMatrix): Rectangle {
    const { x, y, width, height } = rect

    const corners: XY[] = [
      { x, y },
      { x: x + width, y },
      { x: x + width, y: y + height },
      { x, y: y + height },
    ]

    const pts = m ? corners.map(p => applyMatrix(p, m)) : corners

    let minX = Infinity
    let minY = Infinity
    let maxX = -Infinity
    let maxY = -Infinity

    for (const p of pts) {
      if (p.x < minX)
        minX = p.x
      if (p.y < minY)
        minY = p.y
      if (p.x > maxX)
        maxX = p.x
      if (p.y > maxY)
        maxY = p.y
    }

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    }
  },
}
