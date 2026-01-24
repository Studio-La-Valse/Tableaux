import type { Rectangle } from './rectangle'
import type { CurveOps } from './union/curve-ops'
import type { DrawableOps } from './union/drawable/drawable-ops'
import type { SurfaceOps } from './union/surface-ops'
import type { XY } from './xy'
import type { JsonObject } from '@/graph/core/models/json-value'
import { drawShape } from '@/bitmap-painters/bitmap-painter'

export type RectangleOps = SurfaceOps<Rectangle> & CurveOps<Rectangle> & DrawableOps<Rectangle> & {

}

export const rectangleOps: RectangleOps = {
  match(object: JsonObject): object is Rectangle {
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
    if (rectangleOps.match(object)) {
      return { ...object }
    }
    throw new Error('This object could not be cast to a rectangle shape.')
  },

  /**
   * Parameter t ∈ [0,1] walks the perimeter clockwise starting at (x, y).
   */
  pointAt(rect: Rectangle, t: number): XY {
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
      return pt
    }

    let d = t * p

    // Walk edges clockwise
    if (d <= width) {
      const pt = { x: x + d, y }
      return pt
    }
    d -= width

    if (d <= height) {
      const pt = { x: x + width, y: y + d }
      return pt
    }
    d -= height

    if (d <= width) {
      const pt = { x: x + width - d, y: y + height }
      return pt
    }
    d -= width

    // Last edge
    const pt = { x, y: y + height - d }
    return pt
  },

  /**
   * Perimeter length.
   * Transform rules:
   *   - uniform scale supported
   *   - non-uniform scale or shear rejected
   */
  length(rect: Rectangle): number {
    const { width, height } = rect

    if (width < 0 || height < 0) {
      throw new Error('RectangleOps.length: width and height must be non-negative.')
    }

    const base = 2 * (width + height)

    return base
  },

  /**
   * AABB of the transformed rectangle.
   * If no transform: trivial.
   * If transform: transform all 4 corners and compute AABB.
   */
  boundingBox(rect: Rectangle): Rectangle {
    const { x, y, width, height } = rect

    const pts: XY[] = [
      { x, y },
      { x: x + width, y },
      { x: x + width, y: y + height },
      { x, y: y + height },
    ]

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

  circumference(object: Rectangle): number {
    return this.length(object)
  },

  area(object: Rectangle): number {
    return object.height * object.width
  },

  center(object: Rectangle): XY {
    return {
      x: object.x + object.width / 2,
      y: object.y + object.height / 2,
    }
  },

  draw(ctx: CanvasRenderingContext2D, element: Rectangle) {
    drawShape(ctx, element, () => {
      const { x, y, width, height, radii } = element
      if (radii) {
        ctx.roundRect(x, y, width, height, radii)
      }
      else {
        ctx.rect(x, y, width, height)
      }
    })
  },
}
