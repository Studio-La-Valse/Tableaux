import type { Arc } from './arc'
import type { Circle } from './circle'
import type { Ellipse } from './ellipse'
import { type EllipticalArc } from './elliptical-arc'
import { type Parallelogram } from './parallelogram'
import type { Rectangle } from './rectangle'
import type { Square } from './square'
import { isTransformationMatrix } from './transformation-matrix'

export const surfaceKinds = [
  'arc',
  'elliptical-arc',
  'circle',
  'ellipse',
  'square',
  'rectangle',
  'parallelogram',
] as const

export type SurfaceKind = (typeof surfaceKinds)[number]

export type SurfaceLike =
  | Arc
  | EllipticalArc
  | Circle
  | Ellipse
  | Square
  | Rectangle
  | Parallelogram

export function isSurfaceKind(value: string): value is SurfaceKind {
  return surfaceKinds.includes(value as SurfaceKind)
}

export function isSurfaceLike(value: unknown): value is SurfaceLike {
  return (
    typeof value === 'object' &&
    value !== null &&
    'kind' in value &&
    typeof value.kind === 'string' &&
    isSurfaceKind(value.kind) &&
    'transformation' in value &&
    isTransformationMatrix(value.transformation)
  )
}

export function assertIsSurfaceLike(value: unknown): SurfaceLike {
  if (!isSurfaceLike(value)) {
    throw new Error('Value is not surface-like.')
  }

  return value
}
