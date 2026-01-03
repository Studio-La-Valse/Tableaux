import type { BaseShape } from './shape'
import type { Ellipse } from '@/geometry/primitives/ellipse'
import type { XY } from '@/geometry/primitives/xy'

export type EllipseShape = BaseShape & { kind: 'ellipse' } & Ellipse

export function createEllipseShape(
  origin: XY,
  radiusX: number,
  radiusY: number,
  rotation: number,
): EllipseShape {
  return {
    ...origin,
    kind: 'ellipse',
    radiusX,
    radiusY,
    rotation,
  }
}
