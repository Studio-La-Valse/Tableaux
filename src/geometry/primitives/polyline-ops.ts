import type { TransformationMatrix } from '../transform/transformation-matrix'
import type { Polyline } from './polyline'
import type { Rectangle } from './rectangle'
import type { CurveOps } from './union/curve-ops'
import type { DrawableOps } from './union/drawable/drawable-ops'
import type { XY } from './xy'
import type { JsonObject } from '@/graph/core/models/json-value'
import { drawShape } from '@/bitmap-painters/bitmap-painter'
import { lineOps } from './line-ops'
import { rectangleOps } from './rectangle-ops'
import { applyMatrix, isXY } from './xy'

export type PolylineOps = CurveOps<Polyline> & DrawableOps<Polyline> & {

}

export const polylineOps: PolylineOps = {
  match(object: JsonObject): object is Polyline {
    if (
      typeof object !== 'object'
      || object === null
      || !('start' in object)
      || !('end' in object)
    ) {
      return false
    }

    if (!isXY(object.start) || !isXY(object.end))
      return false

    if ('points' in object && object.points !== undefined) {
      if (!Array.isArray(object.points))
        return false
      for (const p of object.points) {
        if (!isXY(p))
          return false
      }
    }

    return true
  },

  cast(object: JsonObject): Polyline {
    if (this.match(object)) {
      return {
        start: { ...object.start },
        end: { ...object.end },
        points: object.points ? object.points.map(p => ({ ...p })) : undefined,
      }
    }

    if (lineOps.match(object)) {
      return {
        ...object,
        points: [],
      }
    }

    if (rectangleOps.match(object)) {
      const { x, y, width, height } = object
      return {
        ...object,
        start: { x, y },
        end: { x, y },
        points: [
          { x: x + width, y },
          { x: x + width, y: y + height },
          { x, y: y + height },
        ],
      }
    }

    throw new Error('This object could not be cast to a polyline shape.')
  },

  /**
   * Parameter t ∈ [0,1] moves along the entire polyline.
   * We compute cumulative segment lengths and find which segment t falls into.
   */
  pointAt(shape: Polyline, t: number, m?: TransformationMatrix): XY {
    if (t < 0 || t > 1) {
      throw new Error(`PolylineOps.pointAt: parameter t=${t} is outside [0,1].`)
    }

    const pts: XY[] = [
      shape.start,
      ...(shape.points ?? []),
      shape.end,
    ]

    // Compute segment lengths
    const segLengths: number[] = []
    let total = 0

    for (let i = 0; i < pts.length - 1; i++) {
      const dx = pts[i + 1].x - pts[i].x
      const dy = pts[i + 1].y - pts[i].y
      const len = Math.hypot(dx, dy)
      segLengths.push(len)
      total += len
    }

    if (total === 0) {
      throw new Error('PolylineOps.pointAt: polyline has zero total length.')
    }

    // Find segment where t lies
    let dist = t * total
    let segIndex = 0

    while (segIndex < segLengths.length && dist > segLengths[segIndex]) {
      dist -= segLengths[segIndex]
      segIndex++
    }

    // Clamp to last segment if floating point drift occurs
    if (segIndex >= segLengths.length)
      segIndex = segLengths.length - 1

    const p0 = pts[segIndex]
    const p1 = pts[segIndex + 1]
    const segLen = segLengths[segIndex]

    const localT = segLen === 0 ? 0 : dist / segLen

    const p: XY = {
      x: p0.x + (p1.x - p0.x) * localT,
      y: p0.y + (p1.y - p0.y) * localT,
    }

    return m ? applyMatrix(p, m) : p
  },

  /**
   * Total polyline length = sum of segment lengths.
   * If a transform is present:
   *   - uniform scale is supported
   *   - non-uniform scale or shear is rejected
   */
  length(shape: Polyline, m?: TransformationMatrix): number {
    const pts: XY[] = [
      shape.start,
      ...(shape.points ?? []),
      shape.end,
    ]

    let total = 0
    for (let i = 0; i < pts.length - 1; i++) {
      const dx = pts[i + 1].x - pts[i].x
      const dy = pts[i + 1].y - pts[i].y
      total += Math.hypot(dx, dy)
    }

    if (!m)
      return total

    // Extract scale from matrix
    const sx = Math.hypot(m.a, m.b)
    const sy = Math.hypot(m.c, m.d)

    if (Math.abs(sx - sy) > 1e-9) {
      throw new Error(
        'PolylineOps.length: non-uniform scaling or shear makes length undefined.',
      )
    }

    return total * sx
  },

  /**
   * AABB of all transformed points.
   */
  boundingBox(shape: Polyline, m?: TransformationMatrix): Rectangle {
    const pts: XY[] = [
      shape.start,
      ...(shape.points ?? []),
      shape.end,
    ]

    const transformed = m ? pts.map(p => applyMatrix(p, m)) : pts

    let minX = Infinity
    let minY = Infinity
    let maxX = -Infinity
    let maxY = -Infinity

    for (const p of transformed) {
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

  draw(ctx: CanvasRenderingContext2D, element: Polyline) {
    drawShape(ctx, element, () => {
      const { start, end, points } = element
      ctx.moveTo(start.x, start.y)
      for (const p of points ?? []) {
        ctx.lineTo(p.x, p.y)
      }
      ctx.lineTo(end.x, end.y)
    })
  },
}
