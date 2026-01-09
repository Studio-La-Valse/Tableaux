import type { ColorRGB } from '@/geometry/color/color'
import type { JsonObject } from '@/graph/core/models/json-value'
import { isColorRGB } from '@/geometry/color/color-rgb'

export type Fill = { fill: ColorRGB }

export function hasFill(value: JsonObject): value is Fill {
  return 'fill' in value && typeof value.fill === 'object' && isColorRGB(value.fill)
}
