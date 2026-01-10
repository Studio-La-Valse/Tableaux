import type { EllipticalArc } from './elliptical-arc'
import type { Rectangle } from './rectangle'
import type { CurveOps } from './union/curve-ops'
import type { DrawableOps } from './union/drawable/drawable-ops'
import type { XY } from './xy'
import type { JsonObject } from '@/graph/core/models/json-value'
import { drawShape } from '@/bitmap-painters/bitmap-painter'
import { arcOps } from './arc-ops'
import { circleOps } from './circle-ops'
import { ellipseOps } from './ellipse-ops'

export type EllipticalArcOps = CurveOps<EllipticalArc> & DrawableOps<EllipticalArc> & {

}

export const ellipticalArcOps: EllipticalArcOps = {
  match(object: JsonObject): object is EllipticalArc {
    return (
      typeof object === 'object'
      && object !== null
      && typeof object.x === 'number'
      && typeof object.y === 'number'
      && typeof object.radiusX === 'number'
      && typeof object.radiusY === 'number'
      && typeof object.rotation === 'number'
      && typeof object.startAngle === 'number'
      && typeof object.endAngle === 'number'
      && typeof object.counterclockwise === 'boolean'
    )
  },

  cast(object: JsonObject): EllipticalArc {
    if (ellipticalArcOps.match(object)) {
      return { ...object }
    }

    if (ellipseOps.match(object)) {
      return {
        ...object,
        radiusX: object.radiusX,
        radiusY: object.radiusY,
        rotation: 0,
        startAngle: 0,
        endAngle: Math.PI * 2,
        counterclockwise: false,
      }
    }

    if (circleOps.match(object)) {
      return {
        ...object,
        radiusX: object.radius,
        radiusY: object.radius,
        rotation: 0,
        startAngle: 0,
        endAngle: Math.PI * 2,
        counterclockwise: false,
      }
    }

    if (arcOps.match(object)) {
      return {
        ...object,
        radiusX: object.radius,
        radiusY: object.radius,
        rotation: 0,
      }
    }

    throw new Error('Object could not be cast to an elliptical arc.')
  },

  /**
   * Parametric evaluation:
   *   θ(t) = startAngle + sweep * t
   *   sweep depends on counterclockwise flag
   *
   * Ellipse parametric form with rotation:
   *   x = cx + rx * cosθ * cosφ - ry * sinθ * sinφ
   *   y = cy + rx * cosθ * sinφ + ry * sinθ * cosφ
   */
  pointAt(shape: EllipticalArc, t: number): XY {
    if (t < 0 || t > 1) {
      throw new Error(`EllipticalArcOps.pointAt: parameter t=${t} is outside [0,1].`)
    }

    const {
      x: cx,
      y: cy,
      radiusX: rx,
      radiusY: ry,
      rotation,
      startAngle,
      endAngle,
      counterclockwise,
    } = shape

    if (rx <= 0 || ry <= 0) {
      throw new Error('EllipticalArcOps.pointAt: radii must be > 0.')
    }

    const twoPi = Math.PI * 2
    const norm = (a: number) => {
      a = a % twoPi
      return a < 0 ? a + twoPi : a
    }

    const a0 = norm(startAngle)
    const a1 = norm(endAngle)

    // Determine sweep direction
    let sweep = a1 - a0
    if (counterclockwise) {
      if (sweep < 0)
        sweep += twoPi
    }
    else {
      if (sweep > 0)
        sweep -= twoPi
    }

    const theta = a0 + sweep * t

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
   * Arc length approximation:
   *   - sample N points along the arc
   *   - sum segment lengths
   *
   * Transform rules:
   *   - uniform scale supported
   *   - non-uniform scale or shear rejected
   */
  length(shape: EllipticalArc): number {
    const steps = 64
    let total = 0

    let prev = ellipticalArcOps.pointAt(shape, 0)

    for (let i = 1; i <= steps; i++) {
      const t = i / steps
      const p = ellipticalArcOps.pointAt(shape, t)
      total += Math.hypot(p.x - prev.x, p.y - prev.y)
      prev = p
    }

    return total
  },

  /**
   * Bounding box:
   *   - sample arc at N points
   *   - transform if needed
   *   - compute AABB
   */
  boundingBox(a: EllipticalArc): Rectangle {
    const { x, y, radiusX, radiusY, rotation, startAngle, endAngle, counterclockwise } = a

    // Normalize angles to [0, 2π)
    const norm = (ang: number) => {
      ang = ang % (Math.PI * 2)
      return ang < 0 ? ang + Math.PI * 2 : ang
    }

    const a0 = norm(startAngle)
    const a1 = norm(endAngle)

    // Check if angle 'ang' lies within the arc sweep
    const angleInArc = (ang: number) => {
      if (counterclockwise) {
        if (a0 <= a1)
          return ang >= a0 && ang <= a1
        return ang >= a0 || ang <= a1
      }
      else {
        if (a1 <= a0)
          return ang <= a0 && ang >= a1
        return ang <= a0 || ang >= a1
      }
    }

    // Convert ellipse param angle → world point (before transform)
    const ellipsePoint = (ang: number) => {
      // Local ellipse point before rotation
      const px = radiusX * Math.cos(ang)
      const py = radiusY * Math.sin(ang)

      // Apply ellipse rotation
      const cosR = Math.cos(rotation)
      const sinR = Math.sin(rotation)

      return {
        x: x + px * cosR - py * sinR,
        y: y + px * sinR + py * cosR,
      }
    }

    // Candidate angles: start, end, and cardinal angles
    const candidates = [a0, a1]

    const cardinals = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2]
    for (const c of cardinals) {
      if (angleInArc(c))
        candidates.push(c)
    }

    // Compute points
    const pts = candidates.map(ellipsePoint)

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

  draw(ctx: CanvasRenderingContext2D, element: EllipticalArc) {
    drawShape(ctx, element, () => {
      const { x, y, radiusX, radiusY, rotation } = element
      const startAngle = element.startAngle
      const endAngle = element.endAngle ?? Math.PI * 2
      const counterclockwise = element.counterclockwise ?? false

      ctx.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, counterclockwise)
    })
  },
}
