import type { Ellipse } from './ellipse'
import type { Rectangle } from './rectangle'
import type { CurveOps } from './union/curve-ops'
import type { DrawableOps } from './union/drawable/drawable-ops'
import type { SurfaceOps } from './union/surface-ops'
import type { XY } from './xy'
import type { JsonObject } from '@/graph/core/models/json-value'
import { drawShape } from '@/bitmap-painters/bitmap-painter'

export type EllipseOps = SurfaceOps<Ellipse> & CurveOps<Ellipse> & DrawableOps<Ellipse> & {

}

export const ellipseOps: EllipseOps = {
  match(object: JsonObject): object is Ellipse {
    return (
      typeof object === 'object'
      && object !== null
      && typeof object.x === 'number'
      && typeof object.y === 'number'
      && typeof object.radiusX === 'number'
      && typeof object.radiusY === 'number'
      && typeof object.rotation === 'number'
    )
  },

  cast(object: JsonObject): Ellipse {
    if (ellipseOps.match(object)) {
      return { ...object }
    }
    throw new Error('This object could not be cast to an ellipse shape.')
  },

  /**
   * Parameter t ∈ [0,1] maps to angle θ = t * 2π.
   * Ellipse parametric form with rotation:
   *
   * x = cx + rx * cosθ * cosφ - ry * sinθ * sinφ
   * y = cy + rx * cosθ * sinφ + ry * sinθ * cosφ
   */
  pointAt(shape: Ellipse, t: number): XY {
    if (t < 0 || t > 1) {
      throw new Error(`EllipseOps.pointAt: parameter t=${t} is outside [0,1].`)
    }

    const { x: cx, y: cy, radiusX: rx, radiusY: ry, rotation } = shape

    if (rx <= 0 || ry <= 0) {
      throw new Error('EllipseOps.pointAt: radii must be > 0.')
    }

    const theta = t * Math.PI * 2
    const cosT = Math.cos(theta)
    const sinT = Math.sin(theta)
    const cosR = Math.cos(rotation)
    const sinR = Math.sin(rotation)

    const px = cx + rx * cosT * cosR - ry * sinT * sinR
    const py = cy + rx * cosT * sinR + ry * sinT * cosR

    const p: XY = { x: px, y: py }
    return p
  },

  /**
   * Approximate ellipse circumference using Ramanujan's second approximation:
   *
   *   h = ((rx - ry)^2) / ((rx + ry)^2)
   *   L ≈ π (rx + ry) [1 + 3h / (10 + sqrt(4 - 3h))]
   *
   * Transform rules:
   *   - uniform scale supported
   *   - non-uniform scale or shear rejected
   */
  length(shape: Ellipse): number {
    const { radiusX: rx, radiusY: ry } = shape

    if (rx <= 0 || ry <= 0) {
      throw new Error('EllipseOps.length: radii must be > 0.')
    }

    const h = ((rx - ry) ** 2) / ((rx + ry) ** 2)
    const base
      = Math.PI * (rx + ry) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)))

    return base
  },

  /**
   * Bounding box:
   *   - sample ellipse at N angles
   *   - include transformed points if matrix present
   */
  boundingBox(e: Ellipse): Rectangle {
    const { x, y, radiusX, radiusY, rotation } = e

    // Precompute rotation
    const cosR = Math.cos(rotation)
    const sinR = Math.sin(rotation)

    // Helper: rotate a local point (px, py) around the ellipse center
    const rotatePoint = (px: number, py: number) => ({
      x: x + px * cosR - py * sinR,
      y: y + px * sinR + py * cosR,
    })

    // Cardinal points before rotation:
    // (±radiusX, 0), (0, ±radiusY)
    const pts = [
      rotatePoint(radiusX, 0),
      rotatePoint(-radiusX, 0),
      rotatePoint(0, radiusY),
      rotatePoint(0, -radiusY),
    ]

    // Compute AABB
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

  circumference(object: Ellipse): number {
    return this.length(object)
  },

  area(object: Ellipse): number {
    const { radiusX, radiusY } = object

    if (radiusX < 0 || radiusY < 0) {
      throw new Error('Ellipse radii must be non‑negative')
    }

    return Math.PI * radiusX * radiusY
  },

  center(object: Ellipse): { x: number, y: number } {
    const { x, y } = object
    return { x, y }
  },

  draw(ctx: CanvasRenderingContext2D, element: Ellipse) {
    drawShape(ctx, element, () => {
      const { x, y, radiusX, radiusY, rotation } = element
      const startAngle = 0
      const endAngle = Math.PI * 2
      const counterclockwise = false

      ctx.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, counterclockwise)
    })
  },
}
