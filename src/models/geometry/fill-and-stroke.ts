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

export type Stroke = { stroke: ColorRGB; strokeWidth: number }

export function hasStroke(value: object): value is Stroke {
  return (
    typeof value === 'object' &&
    value !== null &&
    'stroke' in value &&
    typeof value.stroke === 'object' &&
    isColorRGB(value.stroke) &&
    'strokeWidth' in value &&
    typeof value.strokeWidth === 'number'
  )
}
