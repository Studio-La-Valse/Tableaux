import type { BaseShape } from './shape'
import type { EllipticalArc } from '@/geometry/primitives/elliptical-arc'
import type { XY } from '@/geometry/primitives/xy'
import type { TransformationMatrix } from '@/geometry/transform/transformation-matrix'

export type EllipticalArcShape = BaseShape & {
  kind: 'elliptical-arc'
} & EllipticalArc

export function createEllipticalArc(
  origin: XY,
  radiusX: number,
  radiusY: number,
  rotation: number,
  startAngle: number,
  endAngle: number,
  counterclockwise: boolean = false,
  transformationMatrix?: TransformationMatrix,
): EllipticalArcShape {
  return {
    kind: 'elliptical-arc',
    ...origin,
    radiusX,
    radiusY,
    rotation,
    startAngle,
    endAngle,
    counterclockwise,
    t: transformationMatrix,
  }
}
