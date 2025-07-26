import type { Circle } from './circle'
import type { Line } from './line'
import type { Rectangle } from './rectangle'
import {
  compose,
  createRotation,
  createScale,
  createScaleUniform,
  createTranslation,
  type TransformationMatrix,
  type TransformedObject,
} from './transformation-matrix'
import type { XY } from './xy'

export type ShapeKind = 'circle' | 'line' | 'rectangle'

export type BaseShape = {
  kind: ShapeKind
  transformation: TransformationMatrix
}

export type Geometry = Circle | Line | Rectangle

export function translate<T extends Geometry>(geometry: T, delta: XY): TransformedObject<T> {
  const transformationMatrix = createTranslation(delta)
  const multiplied = compose(transformationMatrix, geometry.transformation)
  return {
    ...geometry,
    transformation: multiplied,
  }
}

export function scale<T extends Geometry>(
  geometry: T,
  origin: XY,
  factor: XY,
): TransformedObject<T> {
  const transformationMatrix = createScale(origin, factor)
  const multiplied = compose(transformationMatrix, geometry.transformation)
  return {
    ...geometry,
    transformation: multiplied,
  }
}

export function scaleUniform<T extends Geometry>(
  geometry: T,
  origin: XY,
  factor: number,
): TransformedObject<T> {
  const transformationMatrix = createScaleUniform(origin, factor)
  const multiplied = compose(transformationMatrix, geometry.transformation)
  return {
    ...geometry,
    transformation: multiplied,
  }
}

export function rotate<T extends Geometry>(
  geometry: T,
  origin: XY,
  angle: number,
): TransformedObject<T> {
  const transformationMatrix = createRotation(origin, angle)
  const multiplied = compose(transformationMatrix, geometry.transformation)
  return {
    ...geometry,
    transformation: multiplied,
  }
}
