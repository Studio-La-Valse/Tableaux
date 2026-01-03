import type { TransformationMatrix } from '../transform/transformation-matrix'
import type { Polyline } from './polyline'
import type { JsonObject } from '@/graph/core/models/json-value'
import { applyMatrix } from './xy'

export type Rectangle = {
  x: number
  y: number
  width: number
  height: number
}

export function isRectangle(object: object): object is Rectangle {
  return (
    'x' in object
    && typeof object.x === 'number'
    && 'y' in object
    && typeof object.y === 'number'
    && 'width' in object
    && typeof object.width === 'number'
    && 'height' in object
    && typeof object.height === 'number'
  )
}

export function asRectangle(shape: JsonObject): Rectangle {
  if (isRectangle(shape)) {
    return {
      ...shape,
    }
  }

  throw new Error('Provided value could not be cast to a rectangle')
}

export function rectangleAsPolyline(rectangle: Rectangle): Polyline {
  const { x, y, width, height } = rectangle
  return {
    ...rectangle,
    start: { x, y },
    end: { x, y },
    points: [
      { x: x + width, y },
      { x: x + width, y: y + height },
      { x, y: y + height },
    ],
  }
}

export function getBoundingBoxRectangle(rect: Rectangle, t?: TransformationMatrix) {
  const { x, y, width, height } = rect

  // Four corners of the rectangle
  let pts = [
    { x, y },
    { x: x + width, y },
    { x: x + width, y: y + height },
    { x, y: y + height },
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
