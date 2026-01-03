import type { TransformationMatrix } from '../transform/transformation-matrix'
import type { Circle } from './circle'
import type { EllipticalArc } from './elliptical-arc'
import type { JsonObject } from '@/graph/core/models/json-value'
import { circleAsArc, isCircle } from './circle'
import { applyMatrix } from './xy'

export type Arc = Circle & {
  startAngle: number
  endAngle: number
  counterclockwise: boolean
}

export function isArc(object: JsonObject): object is Arc {
  return (
    isCircle(object)
    && 'startAngle' in object
    && typeof object.startAngle === 'number'
    && 'endAngle' in object
    && typeof object.endAngle === 'number'
    && 'counterclockwise' in object
    && typeof object.counterclockwise === 'boolean'
  )
}

export function asArc(object: JsonObject): Arc {
  if (isArc(object)) {
    return {
      ...object,
    }
  }

  if (isCircle(object)) {
    return circleAsArc(object)
  }

  throw new Error('This object could not be cast to an arc shape.')
}

export function arcAsEllipticalArc(arc: Arc): EllipticalArc {
  return {
    ...arc,
    radiusX: arc.radius,
    radiusY: arc.radius,
    rotation: 0,
  }
}

export function getBoundingBoxArc(arc: Arc, t?: TransformationMatrix) {
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
    min: { x: minX, y: minY },
    width: maxX - minX,
    height: maxY - minY,
  }
}
