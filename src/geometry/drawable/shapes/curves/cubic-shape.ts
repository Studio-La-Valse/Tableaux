import type { BaseShape } from '../shape'
import type { Cubic } from '@/geometry/primitives/cubic'
import type { XY } from '@/geometry/primitives/xy'
import type { TransformationMatrix } from '@/geometry/transform/transformation-matrix'

// Cubic Bézier: start → control1 → control2 → end
export type CubicShape = BaseShape & {
  kind: 'cubic'
} & Cubic

export function createCubic(
  start: XY,
  control1: XY,
  control2: XY,
  end: XY,
  t?: TransformationMatrix,
): CubicShape {
  return {
    kind: 'cubic',
    start,
    control1,
    control2,
    end,
    t,
  }
}
