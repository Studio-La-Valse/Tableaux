import { hasFill, hasStroke, type Fill, type Stroke } from './fill-and-stroke'
import { isXY, type XY } from './xy'

export type Rectangle = { topLeft: XY; width: number; height: number }

export function isRectangle(value: object): value is Rectangle {
  return (
    'topLeft' in value &&
    isXY(value.topLeft) &&
    'width' in value &&
    typeof value.width === 'number' &&
    'height' in value &&
    typeof value.height === 'number'
  )
}

export type DrawableRectangle = Rectangle & Fill & Stroke

export function isDrawableRectangle(value: object): value is DrawableRectangle {
  return isRectangle(value) && hasFill(value) && hasStroke(value)
}
