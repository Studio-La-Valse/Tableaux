import type { TransformationMatrix } from '../transform/transformation-matrix'
import type { EllipticalArc } from './elliptical-arc'
import type { JsonObject } from '@/graph/core/models/json-value'
import { applyMatrix } from './xy'

export type Ellipse = {
  x: number
  y: number
  radiusX: number
  radiusY: number
  rotation: number
}

export function isEllipse(object: object): object is Ellipse {
  return (
    'x' in object
    && typeof object.x === 'number'
    && 'y' in object
    && typeof object.y === 'number'
    && 'radiusX' in object
    && typeof object.radiusX === 'number'
    && 'radiusY' in object
    && typeof object.radiusY === 'number'
    && 'rotation' in object
    && typeof object.rotation === 'number'
  )
}

export function asEllipse(object: JsonObject): Ellipse {
  if (!isEllipse(object)) {
    throw new Error('Object could not be cast to an ellipse')
  }

  return {
    ...object,
  }
}

export function ellipseAsEllipticalArc(ellipse: Ellipse): EllipticalArc {
  return {
    ...ellipse,
    radiusX: ellipse.radiusX,
    radiusY: ellipse.radiusY,
    rotation: 0,
    startAngle: 0,
    endAngle: Math.PI * 2,
    counterclockwise: false,
  }
}

export function getBoundingBoxEllipse(e: Ellipse, t?: TransformationMatrix) {
  const { x, y, radiusX, radiusY, rotation } = e

  // Precompute rotation
  const cosR = Math.cos(rotation)
  const sinR = Math.sin(rotation)

  // Helper: rotate a local point (px, py) around the ellipse center
  const rotatePoint = (px: number, py: number) => ({
    x: x + px * cosR - py * sinR,
    y: y + px * sinR + py * cosR,
  })

  // Cardinal points before rotation:
  // (±radiusX, 0), (0, ±radiusY)
  let pts = [
    rotatePoint(radiusX, 0),
    rotatePoint(-radiusX, 0),
    rotatePoint(0, radiusY),
    rotatePoint(0, -radiusY),
  ]

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
