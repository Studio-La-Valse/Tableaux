import { hasFill, hasStroke, type Fill, type Stroke } from './fill-and-stroke'
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

export type DrawableCircle = Circle & Fill & Stroke

export function isDrawableCircle(value: object): value is DrawableCircle {
  return isCircle(value) && hasFill(value) && hasStroke(value)
}
