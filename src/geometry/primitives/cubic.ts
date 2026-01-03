import type { TransformationMatrix } from '../transform/transformation-matrix'
import type { Line } from './line'
import type { XY } from './xy'
import type { JsonObject } from '@/graph/core/models/json-value'
import { isLine } from './line'
import { applyMatrix, isXY } from './xy'

export type Cubic = Line & {
  control1: XY
  control2: XY
}

export function isCubic(object: JsonObject): object is Cubic {
  return (
    isLine(object)
    && 'control1' in object
    && isXY(object.control1)
    && 'control2' in object
    && isXY(object.control2)
  )
}

export function asCubic(object: JsonObject): Cubic {
  if (isCubic(object)) {
    return {
      ...object,
    }
  }

  throw new Error('Object could not be cast to a cubic')
}

export function getBoundingBoxCubic(cubic: Cubic, t?: TransformationMatrix) {
  const { start, control1, control2, end } = cubic

  // Helper: apply transform
  const apply = (p: XY) => (t ? applyMatrix(p, t) : p)

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
  let pts: XY[] = []
  for (const tVal of candidates) {
    pts.push({
      x: bezier(start.x, control1.x, control2.x, end.x, tVal),
      y: bezier(start.y, control1.y, control2.y, end.y, tVal),
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
