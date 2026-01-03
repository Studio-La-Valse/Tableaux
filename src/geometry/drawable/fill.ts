import type { Shape } from './shapes/shape'
import type { ColorRGB } from '@/geometry/color/color'
import { isColorRGB } from '@/geometry/color/color-rgb'

export type Fill = { fill: ColorRGB }

export function hasFill(value: Shape): value is Shape & Fill {
  return 'fill' in value && typeof value.fill === 'object' && isColorRGB(value.fill)
}
