import type { TransformationMatrix } from '../transform/transformation-matrix'
import type { Arc } from './arc'
import type { Rectangle } from './rectangle'
import type { CurveOps } from './union/curve-ops'
import type { DrawableOps } from './union/drawable/drawable-ops'
import type { XY } from './xy'
import type { JsonObject } from '@/graph/core/models/json-value'
import { drawShape } from '@/bitmap-painters/bitmap-painter'
import { circleOps } from './circle-ops'
import { applyMatrix } from './xy'

export type ArcOps = CurveOps<Arc> & DrawableOps<Arc> & {

}

export const arcOps: ArcOps = {
  match(object: JsonObject): object is Arc {
    return (
      circleOps.match(object)
      && 'startAngle' in object
      && typeof object.startAngle === 'number'
      && 'endAngle' in object
      && typeof object.endAngle === 'number'
      && 'counterclockwise' in object
      && typeof object.counterclockwise === 'boolean'
    )
  },

  cast(object: JsonObject): Arc {
    if (this.match(object)) {
      return { ...object }
    }

    if (circleOps.match(object)) {
      return {
        ...object,
        startAngle: 0,
        endAngle: Math.PI * 2,
        counterclockwise: false,
      }
    }

    throw new Error('This object could not be cast to an arc shape.')
  },

  /**
   * Return the point at parameter t ∈ [0,1] along the arc.
   */
  pointAt(shape: Arc, t: number, m?: TransformationMatrix): XY {
    if (t < 0 || t > 1) {
      throw new Error(`ArcOps.pointAt: parameter t=${t} is outside [0,1].`)
    }

    const { x, y, radius, startAngle, endAngle, counterclockwise } = shape

    if (radius <= 0) {
      throw new Error('ArcOps.pointAt: arc radius must be > 0.')
    }

    // Normalize angles
    const twoPi = Math.PI * 2
    const norm = (a: number) => {
      a = a % twoPi
      return a < 0 ? a + twoPi : a
    }

    const a0 = norm(startAngle)
    const a1 = norm(endAngle)

    // Compute sweep angle
    let sweep = a1 - a0
    if (counterclockwise) {
      if (sweep < 0)
        sweep += twoPi
    }
    else {
      if (sweep > 0)
        sweep -= twoPi
    }

    const angle = a0 + sweep * t

    const p: XY = {
      x: x + Math.cos(angle) * radius,
      y: y + Math.sin(angle) * radius,
    }

    return m ? applyMatrix(p, m) : p
  },

  /**
   * Arc length = |sweepAngle| * radius
   */
  length(shape: Arc, m?: TransformationMatrix): number {
    const { radius, startAngle, endAngle, counterclockwise } = shape

    if (radius <= 0) {
      throw new Error('ArcOps.length: arc radius must be > 0.')
    }

    const twoPi = Math.PI * 2
    const norm = (a: number) => {
      a = a % twoPi
      return a < 0 ? a + twoPi : a
    }

    const a0 = norm(startAngle)
    const a1 = norm(endAngle)

    let sweep = a1 - a0
    if (counterclockwise) {
      if (sweep < 0)
        sweep += twoPi
    }
    else {
      if (sweep > 0)
        sweep -= twoPi
    }

    const length = Math.abs(sweep) * radius

    // If a transform is present, we approximate length by scaling radius.
    // Only uniform scale is supported — anything else is ambiguous.
    if (m) {
      const sx = Math.hypot(m.a, m.b)
      const sy = Math.hypot(m.c, m.d)

      if (Math.abs(sx - sy) > 1e-9) {
        throw new Error(
          'ArcOps.length: non-uniform scaling matrix makes arc length undefined.',
        )
      }

      return length * sx
    }

    return length
  },

  boundingBox(arc: Arc, t?: TransformationMatrix): Rectangle {
    const { x, y, radius, startAngle, endAngle, counterclockwise } = arc

    // Normalize angles to [0, 2π)
    const norm = (a: number) => {
      a = a % (Math.PI * 2)
      return a < 0 ? a + Math.PI * 2 : a
    }

    const a0 = norm(startAngle)
    const a1 = norm(endAngle)

    // Check if angle 'a' lies within the arc sweep
    const angleInArc = (a: number) => {
      if (counterclockwise) {
        if (a0 <= a1)
          return a >= a0 && a <= a1
        return a >= a0 || a <= a1
      }
      else {
        if (a1 <= a0)
          return a <= a0 && a >= a1
        return a <= a0 || a >= a1
      }
    }

    // Candidate angles: start, end, and cardinal angles
    const candidates = [a0, a1]

    const cardinals = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2]
    for (const c of cardinals) {
      if (angleInArc(c))
        candidates.push(c)
    }

    // Convert angle → point on arc
    let pts = candidates.map(a => ({
      x: x + Math.cos(a) * radius,
      y: y + Math.sin(a) * radius,
    }))

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
  draw(ctx: CanvasRenderingContext2D, element: Arc) {
    drawShape(ctx, element, () => {
      const { x, y, radius } = element
      const startAngle = element.startAngle ?? 0
      const endAngle = element.endAngle ?? Math.PI * 2
      const counterclockwise = element.counterclockwise ?? false

      ctx.arc(x, y, radius, startAngle, endAngle, counterclockwise)
    })
  },
}
