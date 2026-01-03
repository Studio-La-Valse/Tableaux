import type { Fill } from '../fill'
import type { Filter } from '../filter'
import type { Stroke } from '../stroke'
import type { ClearRectShape } from './clear-rect'
import type { CurveLike } from './curves/curve-like'
import type { SurfaceLike } from './surfaces/surface-like'
import type { TextShape } from '@/geometry/text/text'
import type { TransformationMatrix } from '@/geometry/transform/transformation-matrix'
import type { JsonObject } from '@/graph/core/models/json-value'
import { isTextShape } from '@/geometry/text/text'
import { isClearRectShape } from './clear-rect'
import { curveKinds, isCurveLike } from './curves/curve-like'
import { isSurfaceLike, surfaceKinds } from './surfaces/surface-like'

export const shapeKinds = [...curveKinds, ...surfaceKinds, 'text', 'clear-rect'] as const

export type ShapeKind = (typeof shapeKinds)[number]

export function isShapeKind(value: string): value is ShapeKind {
  return shapeKinds.includes(value as ShapeKind)
}

export function assertIsShapeKind(value: string): ShapeKind {
  if (!isShapeKind(value)) {
    throw new Error('Value is not a shape kind')
  }

  return value
}

export function isOfShapeKind<K extends Shape['kind']>(
  geom: Shape,
  allowedKinds: K[],
): geom is Extract<Shape, { kind: K }> {
  return allowedKinds.includes(geom.kind as K)
}

export function assertIsOfShapeKind<K extends Shape['kind']>(
  geom: Shape,
  allowedKinds: K[],
): Extract<Shape, { kind: K }> {
  if (!allowedKinds.includes(geom.kind as K)) {
    throw new Error(
      `Provided shape with kind ${geom.kind} is not of kind [${allowedKinds.join(', ')}]`,
    )
  }

  return geom as Extract<Shape, { kind: K }>
}

export type BaseShape = {
  kind: ShapeKind
  t?: TransformationMatrix
} & Filter
& Partial<Stroke & Fill>

export type Shape = SurfaceLike | CurveLike | TextShape | ClearRectShape

export function isShape(value: JsonObject): value is Shape {
  return (
    isSurfaceLike(value) || isCurveLike(value) || isTextShape(value) || isClearRectShape(value)
  )
}

export function asShape(value: JsonObject): Shape {
  if (!isShape(value)) {
    throw new Error('Value is not a shape.')
  }

  return { ...value }
}
