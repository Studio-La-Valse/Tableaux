import type { ColorRGB } from '@/geometry/color/color'
import type { JsonObject } from '@/graph/core/models/json-value'
import { isColorRGB } from '@/geometry/color/color-rgb'

export type Stroke = { stroke: ColorRGB, strokeWidth: number }

export function hasStroke(value: JsonObject): value is Stroke {
  return (
    'stroke' in value
    && typeof value.stroke === 'object'
    && isColorRGB(value.stroke)
    && 'strokeWidth' in value
    && typeof value.strokeWidth === 'number'
  )
}
