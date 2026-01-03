import type { Shape } from './shapes/shape'
import type { ColorRGB } from '@/geometry/color/color'
import { isColorRGB } from '@/geometry/color/color-rgb'

export type Stroke = { stroke: ColorRGB, strokeWidth: number }

export function hasStroke(value: Shape): value is Shape & Stroke {
  return (
    'stroke' in value
    && typeof value.stroke === 'object'
    && isColorRGB(value.stroke)
    && 'strokeWidth' in value
    && typeof value.strokeWidth === 'number'
  )
}
