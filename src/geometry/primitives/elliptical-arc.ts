import type { TransformationMatrix } from '../transform/transformation-matrix'
import type { Ellipse } from './ellipse'
import type { JsonObject } from '@/graph/core/models/json-value'
import { arcAsEllipticalArc, isArc } from './arc'
import { circleAsEllipticalArc, isCircle } from './circle'
import { ellipseAsEllipticalArc, isEllipse } from './ellipse'
import { applyMatrix } from './xy'

export type EllipticalArc = Ellipse & {
  startAngle: number
  endAngle: number
  counterclockwise: boolean
}

export function isEllipticalArc(object: object): object is EllipticalArc {
  return (
    isEllipse(object)
    && 'startAngle' in object
    && typeof object.startAngle === 'number'
    && 'endAngle' in object
    && typeof object.endAngle === 'number'
    && 'counterclockwise' in object
    && typeof object.counterclockwise === 'boolean'
  )
}

export function getBoundingBoxEllipticalArc(a: EllipticalArc, t?: TransformationMatrix) {
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
  let pts = candidates.map(ellipsePoint)

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

export function asEllipticalArc(object: JsonObject): EllipticalArc {
  if (isEllipticalArc(object)) {
    return {
      ...object,
    }
  }

  if (isEllipse(object)) {
    return ellipseAsEllipticalArc(object)
  }

  if (isCircle(object)) {
    return circleAsEllipticalArc(object)
  }

  if (isArc(object)) {
    return arcAsEllipticalArc(object)
  }

  throw new Error('Object could not be cast to an elliptical arc.')
}
