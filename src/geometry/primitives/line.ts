import type { Polyline } from './polyline'
import type { XY } from './xy'
import type { JsonObject } from '@/graph/core/models/json-value'
import { isXY } from './xy'

export type Line = { start: XY, end: XY }

export function isLine(object: JsonObject): object is Line {
  return 'start' in object && isXY(object.start) && 'end' in object && isXY(object.end)
}

export function asLine(object: JsonObject): Line {
  if (isLine(object)) {
    return {
      ...object,
    }
  }

  throw new Error('Object could not be cast to line')
}

export function lineAsPolyline(line: Line): Polyline {
  return {
    ...line,
    points: [],
  }
}
