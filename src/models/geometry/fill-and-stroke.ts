import { isRGB, type ColorRGB } from './color-hex'

export type Fill = { fill: ColorRGB }

export function hasFill(value: object): value is Fill {
  return (
    typeof value === 'object' &&
    value !== null &&
    'fill' in value &&
    typeof value.fill === 'object' &&
    isRGB(value.fill)
  )
}

export type Stroke = { stroke: ColorRGB; strokeWidth: number }

export function hasStroke(value: object): value is Stroke {
  return (
    typeof value === 'object' &&
    value !== null &&
    'stroke' in value &&
    typeof value.stroke === 'object' &&
    isRGB(value.stroke) &&
    'strokeWidth' in value &&
    typeof value.strokeWidth === 'number'
  )
}
