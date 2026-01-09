import type { Cubic } from './cubic'
import type { Rectangle } from './rectangle'
import type { CurveOps } from './union/curve-ops'
import type { DrawableOps } from './union/drawable/drawable-ops'
import type { XY } from './xy'
import type { JsonObject } from '@/graph/core/models/json-value'
import { drawShape } from '@/bitmap-painters/bitmap-painter'
import { xyOps } from './xy-ops'

export type CubicOps = CurveOps<Cubic> & DrawableOps<Cubic> & {

}

export const cubicOps: CubicOps = {
  match(object: JsonObject): object is Cubic {
    return (
      typeof object === 'object'
      && object !== null
      && 'start' in object
      && 'end' in object
      && 'control1' in object
      && 'control2' in object
      && xyOps.match(object.start)
      && xyOps.match(object.end)
      && xyOps.match(object.control1)
      && xyOps.match(object.control2)
    )
  },

  cast(object: JsonObject): Cubic {
    if (this.match(object)) {
      return {
        start: { ...object.start },
        end: { ...object.end },
        control1: { ...object.control1 },
        control2: { ...object.control2 },
      }
    }
    throw new Error('This object could not be cast to a cubic Bézier shape.')
  },

  /**
   * Evaluate cubic Bézier at t ∈ [0,1].
   */
  pointAt(shape: Cubic, t: number): XY {
    if (t < 0 || t > 1) {
      throw new Error(`CubicOps.pointAt: parameter t=${t} is outside [0,1].`)
    }

    const { start: P0, control1: P1, control2: P2, end: P3 } = shape

    const u = 1 - t
    const tt = t * t
    const uu = u * u
    const uuu = uu * u
    const ttt = tt * t

    const p: XY = {
      x:
        uuu * P0.x
        + 3 * uu * t * P1.x
        + 3 * u * tt * P2.x
        + ttt * P3.x,
      y:
        uuu * P0.y
        + 3 * uu * t * P1.y
        + 3 * u * tt * P2.y
        + ttt * P3.y,
    }

    return p
  },

  /**
   * Approximate cubic Bézier length using adaptive subdivision.
   * (Exact analytic length requires elliptic integrals.)
   *
   * We use a simple recursive flatness test:
   *   - If control polygon is nearly collinear, approximate with chord.
   *   - Otherwise subdivide.
   *
   * Transform rules:
   *   - uniform scale is supported
   *   - non-uniform scale or shear is rejected
   */
  length(shape: Cubic): number {
    const { start: P0, control1: P1, control2: P2, end: P3 } = shape

    const chord = Math.hypot(P3.x - P0.x, P3.y - P0.y)
    const contNet
      = Math.hypot(P1.x - P0.x, P1.y - P0.y)
        + Math.hypot(P2.x - P1.x, P2.y - P1.y)
        + Math.hypot(P3.x - P2.x, P3.y - P2.y)

    // If nearly straight, approximate with chord
    if (contNet - chord < 1e-6) {
      const base = chord
      return base
    }

    // Otherwise subdivide recursively
    const subdivide = (P0: XY, P1: XY, P2: XY, P3: XY, depth: number): number => {
      if (depth > 12) {
        return Math.hypot(P3.x - P0.x, P3.y - P0.y)
      }

      const chord = Math.hypot(P3.x - P0.x, P3.y - P0.y)
      const contNet
        = Math.hypot(P1.x - P0.x, P1.y - P0.y)
          + Math.hypot(P2.x - P1.x, P2.y - P1.y)
          + Math.hypot(P3.x - P2.x, P3.y - P2.y)

      if (contNet - chord < 1e-6) {
        return chord
      }

      // De Casteljau subdivision
      const P01 = mid(P0, P1)
      const P12 = mid(P1, P2)
      const P23 = mid(P2, P3)
      const P012 = mid(P01, P12)
      const P123 = mid(P12, P23)
      const P0123 = mid(P012, P123)

      return (
        subdivide(P0, P01, P012, P0123, depth + 1)
        + subdivide(P0123, P123, P23, P3, depth + 1)
      )
    }

    const baseLength = subdivide(P0, P1, P2, P3, 0)

    return baseLength
  },

  /**
   * Bounding box via sampling + convex hull of control points.
   * (Exact Bézier extrema require solving derivative roots.)
   *
   * We do:
   *   - include P0, P1, P2, P3
   *   - sample at t = 0..1 in small steps
   *   - transform if needed
   */
  boundingBox(cubic: Cubic): Rectangle {
    const { start, control1, control2, end } = cubic

    // Cubic Bézier interpolation
    const bezier = (p0: number, p1: number, p2: number, p3: number, t: number) => {
      const mt = 1 - t
      return (
        mt * mt * mt * p0
        + 3 * mt * mt * t * p1
        + 3 * mt * t * t * p2
        + t * t * t * p3
      )
    }

    // Solve derivative = 0 for extrema
    const solveExtrema = (p0: number, p1: number, p2: number, p3: number) => {
    // derivative coefficients for cubic Bézier:
    // 3(-p0 + 3p1 - 3p2 + p3)t^2 + 6(p0 - 2p1 + p2)t + 3(p1 - p0)
      const a = -p0 + 3 * p1 - 3 * p2 + p3
      const b = 2 * (p0 - 2 * p1 + p2)
      const c = p1 - p0

      const ts: number[] = []

      if (Math.abs(a) < 1e-12) {
      // Linear derivative
        if (Math.abs(b) > 1e-12) {
          const t = -c / b
          if (t > 0 && t < 1)
            ts.push(t)
        }
      }
      else {
      // Quadratic derivative
        const disc = b * b - 4 * a * c
        if (disc >= 0) {
          const s = Math.sqrt(disc)
          const t1 = (-b + s) / (2 * a)
          const t2 = (-b - s) / (2 * a)
          if (t1 > 0 && t1 < 1)
            ts.push(t1)
          if (t2 > 0 && t2 < 1)
            ts.push(t2)
        }
      }

      return ts
    }

    // Collect candidate t values: endpoints + extrema
    const tx = solveExtrema(start.x, control1.x, control2.x, end.x)
    const ty = solveExtrema(start.y, control1.y, control2.y, end.y)

    const candidates = new Set<number>([0, 1, ...tx, ...ty])

    // Evaluate all candidate points
    const pts: XY[] = []
    for (const tVal of candidates) {
      pts.push({
        x: bezier(start.x, control1.x, control2.x, end.x, tVal),
        y: bezier(start.y, control1.y, control2.y, end.y, tVal),
      })
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

  draw(ctx: CanvasRenderingContext2D, element: Cubic) {
    drawShape(ctx, element, () => {
      const { start, control1, control2, end } = element
      ctx.moveTo(start.x, start.y)
      ctx.bezierCurveTo(control1.x, control1.y, control2.x, control2.y, end.x, end.y)
    })
  },
}

// Helper
function mid(a: XY, b: XY): XY {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
}
