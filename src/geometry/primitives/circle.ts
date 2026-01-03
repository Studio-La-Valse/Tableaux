import type { TransformationMatrix } from '../transform/transformation-matrix'
import type { Arc } from './arc'
import type { EllipticalArc } from './elliptical-arc'
import type { JsonObject } from '@/graph/core/models/json-value'
import { applyMatrix, isXY } from './xy'

export type Circle = { x: number, y: number, radius: number }

export function isCircle(object: JsonObject): object is Circle {
  return isXY(object) && 'radius' in object && typeof object.radius === 'number'
}

export function asCircle(object: JsonObject): Circle {
  if (isCircle(object)) {
    return {
      ...object,
    }
  }

  throw new Error('Object could not be cast to a circle')
}

export function circleAsArc(circle: Circle): Arc {
  return {
    ...circle,
    startAngle: 0,
    endAngle: Math.PI * 2,
    counterclockwise: false,
  }
}

export function circleAsEllipticalArc(circle: Circle): EllipticalArc {
  return {
    ...circle,
    radiusX: circle.radius,
    radiusY: circle.radius,
    rotation: 0,
    startAngle: 0,
    endAngle: Math.PI * 2,
    counterclockwise: false,
  }
}

// Utilities

export function getBoundingBox(circle: Circle, t?: TransformationMatrix) {
  const { x, y, radius } = circle

  // Cardinal points of the circle
  let pts = [
    { x: x + radius, y },
    { x: x - radius, y },
    { x, y: y + radius },
    { x, y: y - radius },
  ]

  if (t) {
    pts = pts.map(p => applyMatrix(p, t))
  }

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
