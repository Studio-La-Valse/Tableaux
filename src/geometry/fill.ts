import { type ColorRGB } from '@/geometry/color';
import { isColorRGB } from '@/geometry/color-rgb';
import type { Shape } from './shape';

export type Fill = { fill: ColorRGB };

export function hasFill(value: Shape): value is Shape & Fill {
  return 'fill' in value && typeof value.fill === 'object' && isColorRGB(value.fill);
}
