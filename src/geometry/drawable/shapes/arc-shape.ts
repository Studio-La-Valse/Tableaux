import type { BaseShape } from './shape'
import type { Arc } from '@/geometry/primitives/arc'
import type { XY } from '@/geometry/primitives/xy'
import type { TransformationMatrix } from '@/geometry/transform/transformation-matrix'

export type ArcShape = BaseShape & {
  kind: 'arc'
} & Arc

export function createArc(
  origin: XY,
  radius: number,
  startAngle: number,
  endAngle: number,
  counterclockwise: boolean = false,
  t?: TransformationMatrix,
): ArcShape {
  return {
    kind: 'arc',
    ...origin,
    radius,
    startAngle,
    endAngle,
    counterclockwise,
    t,
  }
}
