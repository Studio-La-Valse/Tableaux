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
