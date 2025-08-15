import { isTransformationMatrix, type TransformationMatrix } from './transformation-matrix'
import type { TextShape } from './text-shape'
import { curveKinds, type CurveLike } from './curve-like'
import { surfaceKinds, type SurfaceLike } from './surface-like'

export const shapeKinds = [...curveKinds, ...surfaceKinds, 'text'] as const

export type ShapeKind = (typeof shapeKinds)[number]

export type BaseShape = {
  kind: ShapeKind
  transformation: TransformationMatrix
}

export type Shape = CurveLike | SurfaceLike | TextShape

export function isShape(value: unknown): value is Shape {
  return (
    typeof value === 'object' &&
    value !== null &&
    'kind' in value &&
    typeof value.kind === 'string' &&
    isShapeKind(value.kind) &&
    'transformation' in value &&
    isTransformationMatrix(value.transformation)
  )
}

export function isShapeKind(value: string): value is ShapeKind {
  return shapeKinds.includes(value as ShapeKind)
}

export function isOfShapeKind<K extends Shape['kind']>(
  geom: Shape,
  allowedKinds: K[],
): geom is Extract<Shape, { kind: K }> {
  return allowedKinds.includes(geom.kind as K)
}

export function assertIsShape(value: unknown): Shape {
  if (!isShape(value)) {
    throw new Error('Value is not a shape.')
  }

  return value
}

export function assertIsOfShapeKind<K extends Shape['kind']>(
  geom: Shape,
  allowedKinds: K[],
): Extract<Shape, { kind: K }> {
  if (!allowedKinds.includes(geom.kind as K)) {
    throw new Error(`Provided shape is not of kind [${allowedKinds.join(', ')}]`)
  }

  return geom as Extract<Shape, { kind: K }>
}
