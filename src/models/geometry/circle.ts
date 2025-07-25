import { isXY, type XY } from './xy'

export type Circle = { origin: XY; radius: number }

export function isCircle(value: unknown): value is Circle {
  return (
    typeof value === 'object' &&
    value !== null &&
    'origin' in value &&
    isXY(value.origin) &&
    'radius' in value &&
    typeof value.radius === 'number'
  )
}
