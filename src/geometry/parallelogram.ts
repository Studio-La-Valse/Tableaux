import {
  compose,
  createRotation,
  createScale,
  createSkew,
  createTranslation,
  identity,
  type TransformationMatrix,
} from './transformation-matrix'
import { applyMatrix, distance, interpolate, type XY } from './xy'
import type { BaseShape } from './shape'
import {
  IDENTITY_BL,
  IDENTITY_BR,
  IDENTITY_TR,
  IDENTITY_TL,
  IDENTITY_CENTER,
  type Square,
} from './square'
import type { Rectangle } from './rectangle'

export type Parallelogram = BaseShape & { kind: 'parallelogram' }

export function createUnitParallelogram() {
  const transform = identity()
  return createTransformedParallelogram(transform)
}

export function createParallelogram(topLeft: XY, topRight: XY, bottomLeft: XY): Parallelogram {
  // Vectors from topLeft
  const vectorA = {
    x: topRight.x - topLeft.x,
    y: topRight.y - topLeft.y,
  }

  const vectorB = {
    x: bottomLeft.x - topLeft.x,
    y: bottomLeft.y - topLeft.y,
  }

  // Affine transformation matrix:
  // Maps unit square to parallelogram defined by TL, TR, BL
  const transformation: TransformationMatrix = {
    a: vectorA.x,
    b: vectorB.x,
    c: vectorA.y,
    d: vectorB.y,
    e: topLeft.x,
    f: topLeft.y,
  }

  return createTransformedParallelogram(transformation)
}

export function createTransformedParallelogram(
  transformation: TransformationMatrix,
): Parallelogram {
  return { kind: 'parallelogram', transformation }
}

export type DeconstructedParallelogram = {
  bottomLeft: XY
  bottomRight: XY
  topRight: XY
  topLeft: XY
  center: XY
  sideA: number
  sideB: number
  area: number
  perimeter: number
  rotation: number
}

export function deconstruct(p: Parallelogram | Rectangle | Square): DeconstructedParallelogram {
  const bottomLeft = applyMatrix(IDENTITY_BL, p.transformation)
  const bottomRight = applyMatrix(IDENTITY_BR, p.transformation)
  const topRight = applyMatrix(IDENTITY_TR, p.transformation)
  const topLeft = applyMatrix(IDENTITY_TL, p.transformation)
  const center = applyMatrix(IDENTITY_CENTER, p.transformation)

  const sideA = distance(bottomLeft, bottomRight)
  const sideB = distance(bottomLeft, topLeft)

  // Area using vector cross product
  const vectorA = {
    x: bottomRight.x - bottomLeft.x,
    y: bottomRight.y - bottomLeft.y,
  }
  const vectorB = {
    x: topLeft.x - bottomLeft.x,
    y: topLeft.y - bottomLeft.y,
  }
  const area = Math.abs(vectorA.x * vectorB.y - vectorA.y * vectorB.x)

  const perimeter = 2 * (sideA + sideB)

  // Rotation based on top edge direction
  const dx = topRight.x - topLeft.x
  const dy = topRight.y - topLeft.y
  const rotation = Math.atan2(dy, dx)

  return {
    topLeft,
    topRight,
    bottomRight,
    bottomLeft,
    center,
    sideA,
    sideB,
    area,
    perimeter,
    rotation,
  }
}

export function translate(parallelogram: Parallelogram, delta: XY): Parallelogram {
  const transformationMatrix = createTranslation(delta)
  const transformation = compose(transformationMatrix, parallelogram.transformation)
  return {
    ...parallelogram,
    transformation,
  }
}

export function scale(parallelogram: Parallelogram, origin: XY, factor: XY): Parallelogram {
  const transformationMatrix = createScale(origin, factor)
  const transformation = compose(transformationMatrix, parallelogram.transformation)
  return {
    ...parallelogram,
    transformation,
  }
}

export function scaleUniform(
  parallelogram: Parallelogram,
  origin: XY,
  factor: number,
): Parallelogram {
  const transformationMatrix = createScale(origin, { x: factor, y: factor })
  const transformation = compose(transformationMatrix, parallelogram.transformation)
  return {
    ...parallelogram,
    transformation,
  }
}

export function rotate(parallelogram: Parallelogram, origin: XY, angle: number): Parallelogram {
  const transformationMatrix = createRotation(origin, angle)
  const transformation = compose(transformationMatrix, parallelogram.transformation)
  return {
    ...parallelogram,
    transformation,
  }
}

export function skew(parallelogram: Parallelogram, origin: XY, factor: XY): Parallelogram {
  const transformationMatrix = createSkew(origin, factor)
  const transformation = compose(transformationMatrix, parallelogram.transformation)
  return {
    ...parallelogram,
    transformation,
  }
}

export function divideParallelogram(shape: Parallelogram | Rectangle | Square, n: number): XY[] {
  const { topLeft, topRight, bottomRight, bottomLeft, perimeter } = deconstruct(shape)
  const edges: [XY, XY][] = [
    [topLeft, topRight],
    [topRight, bottomLeft],
    [bottomLeft, bottomRight],
    [bottomRight, topLeft],
  ]

  const points: XY[] = []

  let remaining = n
  for (const [a, b] of edges) {
    const len = distance(a, b)
    const count = Math.round((len / perimeter) * n)
    for (let i = 0; i < count && remaining > 0; i++) {
      const t = i / count
      points.push(interpolate(a, b, t))
      remaining--
    }
  }

  return points
}
