import {
  compose,
  createRotation,
  createScale,
  createSkew,
  createTranslation,
  type TransformationMatrix,
} from './transformation-matrix'
import { applyMatrix, distance, type XY } from './xy'
import type { BaseShape } from './shape'
import { createUnitRectangle, type Rectangle } from './rectangle'
import { createTransformedParallelogram, type Parallelogram } from './parallelogram'

export type Square = BaseShape & { kind: 'square' }

export const IDENTITY_TL: XY = { x: 0, y: 0 }
export const IDENTITY_TR: XY = { x: 1, y: 0 }
export const IDENTITY_BR: XY = { x: 1, y: 1 }
export const IDENTITY_BL: XY = { x: 0, y: 1 }
export const IDENTITY_CENTER: XY = { x: 0.5, y: 0.5 }

export function createSquare(topLeft: XY, size: number): Square {
  const transformation: TransformationMatrix = {
    a: size, // scale X
    b: 0,
    c: 0,
    d: size, // scale Y
    e: topLeft.x, // translate X
    f: topLeft.y, // translate Y
  }

  return { kind: 'square', transformation }
}

export type DeconstructedSquare = {
  topLeft: XY
  topRight: XY
  bottomRight: XY
  bottomLeft: XY
  center: XY
  size: number
  rotation: number
  area: number
  perimeter: number
}

export function deconstruct(square: Square): DeconstructedSquare {
  const topLeft = applyMatrix(IDENTITY_TL, square.transformation)
  const topRight = applyMatrix(IDENTITY_TR, square.transformation)
  const bottomRight = applyMatrix(IDENTITY_BR, square.transformation)
  const bottomLeft = applyMatrix(IDENTITY_BL, square.transformation)
  const center = applyMatrix(IDENTITY_CENTER, square.transformation)

  const size = distance(topRight, topLeft)

  const dx = topRight.x - topLeft.x
  const dy = topRight.y - topLeft.y
  const rotation = Math.atan2(dy, dx)

  const area = size * size
  const perimeter = 4 * size

  return {
    topLeft,
    topRight,
    bottomRight,
    bottomLeft,
    center,
    size,
    rotation,
    area,
    perimeter,
  }
}

export function translate(square: Square, delta: XY): Square {
  const transformationMatrix = createTranslation(delta)
  const transformation = compose(transformationMatrix, square.transformation)
  return {
    ...square,
    transformation,
  }
}

export function scale(square: Square, origin: XY, factor: XY): Rectangle {
  const transformationMatrix = createScale(origin, factor)
  const transformation = compose(transformationMatrix, square.transformation)
  const rectangle = createUnitRectangle()
  return {
    ...rectangle,
    transformation,
  }
}

export function scaleUniform(square: Square, origin: XY, factor: number): Square {
  const transformationMatrix = createScale(origin, { x: factor, y: factor })
  const transformation = compose(transformationMatrix, square.transformation)
  return {
    ...square,
    transformation,
  }
}

export function rotate(square: Square, origin: XY, angle: number): Square {
  const transformationMatrix = createRotation(origin, angle)
  const transformation = compose(transformationMatrix, square.transformation)
  return {
    ...square,
    transformation,
  }
}

export function skew(square: Square, origin: XY, factor: XY): Parallelogram {
  const transformationMatrix = createSkew(origin, factor)
  const transformation = compose(transformationMatrix, square.transformation)
  return createTransformedParallelogram(transformation)
}
