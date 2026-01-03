import type { TransformationMatrix } from '../transform/transformation-matrix'
import type { XY } from './xy'
import type { JsonObject } from '@/graph/core/models/json-value'
import { isLine, lineAsPolyline } from './line'
import { isRectangle, rectangleAsPolyline } from './rectangle'
import { applyMatrix } from './xy'

export type Polyline = { start: XY, points?: XY[], end: XY }

export function isPolyline(object: JsonObject): object is Polyline {
  return isLine(object) && 'points' in object && Array.isArray(object.points)
}

export function asPolyline(object: JsonObject): Polyline {
  if (isPolyline(object)) {
    return {
      ...object,
    }
  }

  if (isLine(object)) {
    return lineAsPolyline(object)
  }

  if (isRectangle(object)) {
    return rectangleAsPolyline(object)
  }

  throw new Error('Object could not be cast to a polyline.')
}

// Utilities

export function getBoundingBoxPolyline(polyline: Polyline, t?: TransformationMatrix) {
  // Collect all points in order
  let pts = [
    polyline.start,
    ...polyline.points ?? [],
    polyline.end,
  ]

  // Apply transform if present
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
