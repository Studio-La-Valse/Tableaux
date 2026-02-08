import type { ColorRGB } from '@/geometry/color/color-rgb'
import type { JsonObject } from '@/graph/core/models/json-value'
import { rgbOps } from '@/geometry/color/color-rgb-ops'

export type Fill = { fill: ColorRGB }

export function hasFill(value: JsonObject): value is Fill {
  return 'fill' in value && typeof value.fill === 'object' && rgbOps.match(value.fill)
}
