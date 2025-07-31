import { compose, createRotation, createScale, createSkew, createTranslation, type TransformationMatrix } from './transformation-matrix'
import { applyMatrix, distance, type XY } from './xy'
import type { BaseShape } from './geometry'
import { createTransformedParallelogram, type Parallelogram } from './parallelogram'

export type Rectangle = BaseShape & { kind: 'rectangle' }

export const IDENTITY_RECTANGLE_TL: XY = { x: 0, y: 0 }
export const IDENTITY_RECTANGLE_TR: XY = { x: 1, y: 0 }
export const IDENTITY_RECTANGLE_BR: XY = { x: 1, y: 1 }
export const IDENTITY_RECTANGLE_BL: XY = { x: 0, y: 1 }
export const IDENTITY_RECTANGLE_CENTER: XY = { x: 0.5, y: 0.5 }

export function createUnitRectangle() {
  return createRectangle(IDENTITY_RECTANGLE_TL, 1, 1)
}

export function createRectangle(topLeft: XY, width: number, height: number): Rectangle {
  const transformation: TransformationMatrix = {
    a: width, // scale X
    b: 0,
    c: 0,
    d: height, // scale Y
    e: topLeft.x, // translate X
    f: topLeft.y, // translate Y
  }

  return { kind: 'rectangle', transformation }
}

export type DeconstructedRectangle = {
  topLeft: XY
  topRight: XY
  bottomRight: XY
  bottomLeft: XY
  center: XY
  width: number
  height: number
  rotation: number
  area: number
  perimeter: number
  diagonal: number
}

export function deconstruct(rect: Rectangle): DeconstructedRectangle {
  const topLeft = applyMatrix(IDENTITY_RECTANGLE_TL, rect.transformation)
  const topRight = applyMatrix(IDENTITY_RECTANGLE_TR, rect.transformation)
  const bottomRight = applyMatrix(IDENTITY_RECTANGLE_BR, rect.transformation)
  const bottomLeft = applyMatrix(IDENTITY_RECTANGLE_BL, rect.transformation)
  const center = applyMatrix(IDENTITY_RECTANGLE_CENTER, rect.transformation)

  const width = distance(topRight, topLeft)
  const height = distance(topLeft, bottomLeft)

  const dx = topRight.x - topLeft.x
  const dy = topRight.y - topLeft.y
  const rotation = Math.atan2(dy, dx)

  const area = width * height
  const perimeter = width * 2 + height * 2
  const diagonal = distance(topLeft, bottomRight)

  return {
    topLeft,
    topRight,
    bottomRight,
    bottomLeft,
    center,
    width,
    height,
    rotation,
    area,
    perimeter,
    diagonal,
  }
}

export function translate(square: Rectangle, delta: XY): Rectangle {
  const transformationMatrix = createTranslation(delta)
  const transformation = compose(transformationMatrix, square.transformation)
  return {
    ...square,
    transformation,
  }
}

export function scale(square: Rectangle, origin: XY, factor: XY): Rectangle {
  const transformationMatrix = createScale(origin, factor)
  const transformation = compose(transformationMatrix, square.transformation)
  const rectangle = createUnitRectangle()
  return {
    ...rectangle,
    transformation,
  }
}

export function scaleUniform(square: Rectangle, origin: XY, factor: number): Rectangle {
  const transformationMatrix = createScale(origin, { x: factor, y: factor })
  const transformation = compose(transformationMatrix, square.transformation)
  return {
    ...square,
    transformation,
  }
}

export function rotate(square: Rectangle, origin: XY, angle: number): Rectangle {
  const transformationMatrix = createRotation(origin, angle)
  const transformation = compose(transformationMatrix, square.transformation)
  return {
    ...square,
    transformation,
  }
}

export function skew(square: Rectangle, origin: XY, factor: XY): Parallelogram {
  const transformationMatrix = createSkew(origin, factor)
  const transformation = compose(transformationMatrix, square.transformation)
  return createTransformedParallelogram(transformation)
}
