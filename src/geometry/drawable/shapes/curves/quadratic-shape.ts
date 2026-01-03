import type { BaseShape } from '../shape'
import type { Quadratic } from '@/geometry/primitives/quadratic'
import type { XY } from '@/geometry/primitives/xy'
import type { TransformationMatrix } from '@/geometry/transform/transformation-matrix'

// Quadratic Bézier: start → control → end
export type QuadraticShape = BaseShape
  & Quadratic & {
    kind: 'quadratic'
  }

export function createQuadratic(
  start: XY,
  control: XY,
  end: XY,
  t?: TransformationMatrix,
): QuadraticShape {
  return {
    kind: 'quadratic',
    start,
    control,
    end,
    t,
  }
}
