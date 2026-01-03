import type { TransformationMatrix } from '../transform/transformation-matrix'
import type { Ellipse } from './ellipse'
import type { Rectangle } from './rectangle'
import type { CurveOps } from './union/curve-ops'
import type { XY } from './xy'
import type { JsonObject } from '@/graph/core/models/json-value'
import { applyMatrix } from './xy'

export type EllipseOps = CurveOps<Ellipse> & {

}

export const ellipseOps: EllipseOps = {
  guard(object: JsonObject): object is Ellipse {
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
    if (this.guard(object)) {
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
  pointAt(shape: Ellipse, t: number, m?: TransformationMatrix): XY {
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
    return m ? applyMatrix(p, m) : p
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
  length(shape: Ellipse, m?: TransformationMatrix): number {
    const { radiusX: rx, radiusY: ry } = shape

    if (rx <= 0 || ry <= 0) {
      throw new Error('EllipseOps.length: radii must be > 0.')
    }

    const h = ((rx - ry) ** 2) / ((rx + ry) ** 2)
    const base
      = Math.PI * (rx + ry) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)))

    if (!m)
      return base

    const sx = Math.hypot(m.a, m.b)
    const sy = Math.hypot(m.c, m.d)

    if (Math.abs(sx - sy) > 1e-9) {
      throw new Error(
        'EllipseOps.length: non-uniform scaling or shear makes circumference undefined.',
      )
    }

    return base * sx
  },

  /**
   * Bounding box:
   *   - sample ellipse at N angles
   *   - include transformed points if matrix present
   */
  boundingBox(e: Ellipse, t?: TransformationMatrix): Rectangle {
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
    let pts = [
      rotatePoint(radiusX, 0),
      rotatePoint(-radiusX, 0),
      rotatePoint(0, radiusY),
      rotatePoint(0, -radiusY),
    ]

    // Apply transform if present
    if (t) {
      pts = pts.map(p => applyMatrix(p, t))
    }

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
}
