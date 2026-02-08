import type { ColorRGB } from '@/geometry/color/color-rgb'
import type { JsonObject } from '@/graph/core/models/json-value'
import { rgbOps } from '@/geometry/color/color-rgb-ops'

export type Stroke = { stroke: ColorRGB, strokeWidth: number }

export function hasStroke(value: JsonObject): value is Stroke {
  return (
    'stroke' in value
    && typeof value.stroke === 'object'
    && rgbOps.match(value.stroke)
    && 'strokeWidth' in value
    && typeof value.strokeWidth === 'number'
  )
}
