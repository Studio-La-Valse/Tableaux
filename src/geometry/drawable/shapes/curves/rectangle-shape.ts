import type { BaseShape } from '../shape'
import type { Rectangle } from '@/geometry/primitives/rectangle'
import type { XY } from '@/geometry/primitives/xy'

export type RectangleShape = BaseShape & { kind: 'rectangle', radii?: number | number[] } & Rectangle

export function createRectangleShape(
  topLeft: XY,
  width: number,
  height: number,
  radii?: number | number[],
): RectangleShape {
  return {
    kind: 'rectangle',
    ...topLeft,
    width,
    height,
    radii,
  }
}
