import { type ColorRGB } from './color'
import { isColorRGB } from './color-rgb'

export type Fill = { fill: ColorRGB }

export function hasFill(value: object): value is Fill {
  return (
    typeof value === 'object' &&
    value !== null &&
    'fill' in value &&
    typeof value.fill === 'object' &&
    isColorRGB(value.fill)
  )
}
