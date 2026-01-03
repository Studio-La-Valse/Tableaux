import type { TransformationMatrix } from '../transform/transformation-matrix'
import type { Line } from './line'
import type { XY } from './xy'
import type { JsonObject } from '@/graph/core/models/json-value'
import { isLine } from './line'
import { applyMatrix, isXY } from './xy'

export type Quadratic = Line & {
  control: XY
}

export function isQuadratic(object: JsonObject): object is Quadratic {
  return isLine(object) && 'control' in object && isXY(object.control)
}

export function asQuadratic(object: JsonObject): Quadratic {
  if (isQuadratic(object)) {
    return {
      ...object,
    }
  }

  throw new Error('Object could not be cast to a quadratic')
}

export function getBoundingBoxQuadratic(q: Quadratic, t?: TransformationMatrix) {
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
    min: { x: minX, y: minY },
    width: maxX - minX,
    height: maxY - minY,
  }
}
