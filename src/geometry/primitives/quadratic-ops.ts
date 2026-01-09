import type { TransformationMatrix } from '../transform/transformation-matrix'
import type { Quadratic } from './quadratic'
import type { Rectangle } from './rectangle'
import type { CurveOps } from './union/curve-ops'
import type { DrawableOps } from './union/drawable/drawable-ops'
import type { XY } from './xy'
import type { JsonObject } from '@/graph/core/models/json-value'
import { drawShape } from '@/bitmap-painters/bitmap-painter'
import { applyMatrix, isXY } from './xy'

export type QuadraticOps = CurveOps<Quadratic> & DrawableOps<Quadratic> & {

}

export const quadraticOps: QuadraticOps = {
  match(object: JsonObject): object is Quadratic {
    return (
      typeof object === 'object'
      && object !== null
      && 'start' in object
      && 'end' in object
      && 'control' in object
      && isXY(object.start)
      && isXY(object.end)
      && isXY(object.control)
    )
  },

  cast(object: JsonObject): Quadratic {
    if (this.match(object)) {
      return {
        start: { ...object.start },
        end: { ...object.end },
        control: { ...object.control },
      }
    }
    throw new Error('This object could not be cast to a quadratic Bézier shape.')
  },

  /**
   * Evaluate quadratic Bézier at t ∈ [0,1].
   */
  pointAt(shape: Quadratic, t: number, m?: TransformationMatrix): XY {
    if (t < 0 || t > 1) {
      throw new Error(`QuadraticOps.pointAt: parameter t=${t} is outside [0,1].`)
    }

    const { start: P0, control: P1, end: P2 } = shape

    const u = 1 - t
    const tt = t * t
    const uu = u * u

    const p: XY = {
      x: uu * P0.x + 2 * u * t * P1.x + tt * P2.x,
      y: uu * P0.y + 2 * u * t * P1.y + tt * P2.y,
    }

    return m ? applyMatrix(p, m) : p
  },

  /**
   * Approximate quadratic Bézier length using adaptive subdivision.
   * Transform rules:
   *   - uniform scale supported
   *   - non-uniform scale or shear rejected
   */
  length(shape: Quadratic, m?: TransformationMatrix): number {
    const { start: P0, control: P1, end: P2 } = shape

    const chord = Math.hypot(P2.x - P0.x, P2.y - P0.y)
    const contNet
      = Math.hypot(P1.x - P0.x, P1.y - P0.y)
        + Math.hypot(P2.x - P1.x, P2.y - P1.y)

    // Nearly straight → approximate with chord
    if (contNet - chord < 1e-6) {
      const base = chord
      if (!m)
        return base

      const sx = Math.hypot(m.a, m.b)
      const sy = Math.hypot(m.c, m.d)
      if (Math.abs(sx - sy) > 1e-9) {
        throw new Error(
          'QuadraticOps.length: non-uniform scaling or shear makes length undefined.',
        )
      }
      return base * sx
    }

    // Recursive subdivision
    const subdivide = (P0: XY, P1: XY, P2: XY, depth: number): number => {
      if (depth > 12) {
        return Math.hypot(P2.x - P0.x, P2.y - P0.y)
      }

      const chord = Math.hypot(P2.x - P0.x, P2.y - P0.y)
      const contNet
        = Math.hypot(P1.x - P0.x, P1.y - P0.y)
          + Math.hypot(P2.x - P1.x, P2.y - P1.y)

      if (contNet - chord < 1e-6) {
        return chord
      }

      // Helper
      const mid = (a: XY, b: XY) => {
        return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
      }

      // De Casteljau subdivision
      const P01 = mid(P0, P1)
      const P12 = mid(P1, P2)
      const P012 = mid(P01, P12)

      return (
        subdivide(P0, P01, P012, depth + 1)
        + subdivide(P012, P12, P2, depth + 1)
      )
    }

    const baseLength = subdivide(P0, P1, P2, 0)

    if (!m)
      return baseLength

    const sx = Math.hypot(m.a, m.b)
    const sy = Math.hypot(m.c, m.d)
    if (Math.abs(sx - sy) > 1e-9) {
      throw new Error(
        'QuadraticOps.length: non-uniform scaling or shear makes length undefined.',
      )
    }

    return baseLength * sx
  },

  /**
   * Bounding box via sampling + control points.
   */
  boundingBox(q: Quadratic, t?: TransformationMatrix): Rectangle {
    const { start, control, end } = q

    // Apply transform helper
    const apply = (p: XY) => (t ? applyMatrix(p, t) : p)

    // Quadratic Bézier interpolation
    const bezier = (p0: number, p1: number, p2: number, t: number) => {
      const mt = 1 - t
      return mt * mt * p0 + 2 * mt * t * p1 + t * t * p2
    }

    // Solve derivative = 0 for extrema
    const solveExtrema = (p0: number, p1: number, p2: number) => {
    // derivative: 2(p1 - p0)(1 - t) + 2(p2 - p1)t = 0
    // simplified: t = (p0 - p1) / (p0 - 2p1 + p2)
      const denom = p0 - 2 * p1 + p2
      if (Math.abs(denom) < 1e-12)
        return [] // no interior extrema

      const t = (p0 - p1) / denom
      return t > 0 && t < 1 ? [t] : []
    }

    const tx = solveExtrema(start.x, control.x, end.x)
    const ty = solveExtrema(start.y, control.y, end.y)

    const candidates = new Set<number>([0, 1, ...tx, ...ty])

    // Evaluate all candidate points
    let pts: XY[] = []
    for (const tVal of candidates) {
      pts.push({
        x: bezier(start.x, control.x, end.x, tVal),
        y: bezier(start.y, control.y, end.y, tVal),
      })
    }

    // Apply transform if present
    pts = pts.map(apply)

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
  draw(ctx: CanvasRenderingContext2D, element: Quadratic) {
    drawShape(ctx, element, () => {
      const { start, control, end } = element
      ctx.moveTo(start.x, start.y)
      ctx.quadraticCurveTo(control.x, control.y, end.x, end.y)
    })
  },
}
