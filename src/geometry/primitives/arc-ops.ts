import type { Arc } from './arc'
import type { Rectangle } from './rectangle'
import type { CurveOps } from './union/curve-ops'
import type { DrawableOps } from './union/drawable/drawable-ops'
import type { XY } from './xy'
import type { JsonObject } from '@/graph/core/models/json-value'
import { drawShape } from '@/bitmap-painters/bitmap-painter'
import { circleOps } from './circle-ops'

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
  pointAt(shape: Arc, t: number): XY {
    if (t < 0 || t > 1) {
      throw new Error(`ArcOps.pointAt: parameter t=${t} is outside [0,1].`)
    }

    const { x, y, radius, startAngle, endAngle, counterclockwise } = shape

    if (radius <= 0) {
      throw new Error('ArcOps.pointAt: arc radius must be > 0.')
    }

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

    return {
      x: x + Math.cos(angle) * radius,
      y: y + Math.sin(angle) * radius,
    }
  },

  /**
   * Arc length = |sweepAngle| * radius
   */
  length(shape: Arc): number {
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

    return Math.abs(sweep) * radius
  },

  /**
   * Axis-aligned bounding box of the arc.
   */
  boundingBox(arc: Arc): Rectangle {
    const { x, y, radius, startAngle, endAngle, counterclockwise } = arc

    const norm = (a: number) => {
      a = a % (Math.PI * 2)
      return a < 0 ? a + Math.PI * 2 : a
    }

    const a0 = norm(startAngle)
    const a1 = norm(endAngle)

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

    const candidates = [a0, a1]

    const cardinals = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2]
    for (const c of cardinals) {
      if (angleInArc(c))
        candidates.push(c)
    }

    const pts = candidates.map(a => ({
      x: x + Math.cos(a) * radius,
      y: y + Math.sin(a) * radius,
    }))

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
      ctx.arc(
        element.x,
        element.y,
        element.radius,
        element.startAngle,
        element.endAngle,
        element.counterclockwise,
      )
    })
  },
}
