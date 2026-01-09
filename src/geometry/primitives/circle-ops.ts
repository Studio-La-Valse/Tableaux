import type { Circle } from './circle'
import type { Rectangle } from './rectangle'
import type { CurveOps } from './union/curve-ops'
import type { DrawableOps } from './union/drawable/drawable-ops'
import type { SurfaceOps } from './union/surface-ops'
import type { XY } from './xy'
import type { JsonObject } from '@/graph/core/models/json-value'
import { drawShape } from '@/bitmap-painters/bitmap-painter'
import { xyOps } from './xy-ops'

export type CircleOps = CurveOps<Circle> & SurfaceOps<Circle> & DrawableOps<Circle> & {}

export const circleOps: CircleOps = {
  match(object: JsonObject): object is Circle {
    return (
      xyOps.match(object)
      && 'radius' in object
      && typeof object.radius === 'number'
    )
  },

  cast(object: JsonObject): Circle {
    if (this.match(object)) {
      return { ...object }
    }
    throw new Error('Object could not be cast to a circle')
  },

  /**
   * Returns a point on the circle at parameter t ∈ [0,1].
   * t is interpreted as an angle fraction: angle = t * 2π.
   */
  pointAt(shape: Circle, t: number): XY {
    if (t < 0 || t > 1) {
      throw new Error(`CircleOps.pointAt: t=${t} is outside [0,1].`)
    }

    const angle = t * Math.PI * 2
    return {
      x: shape.x + shape.radius * Math.cos(angle),
      y: shape.y + shape.radius * Math.sin(angle),
    }
  },

  /**
   * Circumference = 2πr
   */
  length(shape: Circle): number {
    if (shape.radius <= 0) {
      throw new Error('CircleOps.length: radius must be > 0.')
    }
    return 2 * Math.PI * shape.radius
  },

  /**
   * Alias for circumference (SurfaceOps compatibility)
   */
  circumference(shape: Circle): number {
    return this.length(shape)
  },

  /**
   * Area = πr²
   */
  area(shape: Circle): number {
    if (shape.radius <= 0) {
      throw new Error('CircleOps.area: radius must be > 0.')
    }
    return Math.PI * shape.radius * shape.radius
  },

  /**
   * Axis-aligned bounding box of the circle.
   */
  boundingBox(shape: Circle): Rectangle {
    const r = shape.radius
    return {
      x: shape.x - r,
      y: shape.y - r,
      width: 2 * r,
      height: 2 * r,
    }
  },

  /**
   * Center of the circle (trivial).
   */
  center(shape: Circle): XY {
    return { x: shape.x, y: shape.y }
  },

  draw(ctx: CanvasRenderingContext2D, element: Circle) {
    drawShape(ctx, element, () => {
      ctx.arc(element.x, element.y, element.radius, 0, Math.PI * 2, false)
    })
  },
}
