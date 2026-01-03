import type { BaseShape } from './shape'
import type { Circle } from '@/geometry/primitives/circle'
import type { XY } from '@/geometry/primitives/xy'

export type CircleShape = BaseShape & { kind: 'circle' } & Circle

export function createCircle(origin: XY, radius: number): CircleShape {
  const circle: CircleShape = {
    kind: 'circle',
    ...origin,
    radius,
  }
  return circle
}
