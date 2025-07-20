import { hasStroke, type Stroke } from './fill-and-stroke'
import { isXY, type XY } from './xy'

export type Line = { start: XY; end: XY }

export function isLine(value: unknown): value is Line {
  return (
    typeof value === 'object' &&
    value !== null &&
    'start' in value &&
    isXY(value.start) &&
    'end' in value &&
    isXY(value.end)
  )
}

export type DrawableLine = Line & Stroke

export function isDrawableLine(value: object): value is DrawableLine {
  return isLine(value) && hasStroke(value)
}
