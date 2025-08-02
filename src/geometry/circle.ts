import {
  compose,
  createRotation,
  createScale,
  createSkew,
  createTranslation,
  type TransformationMatrix,
} from './transformation-matrix'
import { applyMatrix, type XY } from './xy'
import type { BaseShape } from './shape'
import { createUnitEllipse, type Ellipse } from './ellipse'

export type Circle = BaseShape & { kind: 'circle' }

export const IDENTITY_ORIGIN: XY = { x: 0, y: 0 }
export const IDENTITY_RADIUS = 1

export function unitCircle(): Circle {
  return createCircle(IDENTITY_ORIGIN, IDENTITY_RADIUS)
}

export function createCircle(origin: XY, radius: number): Circle {
  const transformation: TransformationMatrix = {
    a: radius, // scale X
    b: 0,
    c: 0,
    d: radius, // scale Y
    e: origin.x, // translate X
    f: origin.y, // translate Y
  }

  return { kind: 'circle', transformation }
}

export type DeconstructedCircle = {
  origin: XY
  radius: number
  rotation: number // in radians
  area: number
  circumference: number
}

export function deconstruct(circle: Circle): DeconstructedCircle {
  const matrix2d = circle.transformation

  // Origin is the transformed (0,0)
  const origin = applyMatrix(IDENTITY_ORIGIN, matrix2d)

  // Transformed unit X vector
  const rightPoint = applyMatrix({ x: 1, y: 0 }, matrix2d)

  // Radius is distance from origin to transformed unit X
  const radius = Math.hypot(rightPoint.x - origin.x, rightPoint.y - origin.y)

  // Rotation is angle of transformed X-axis
  const dx = rightPoint.x - origin.x
  const dy = rightPoint.y - origin.y
  const rotation = Math.atan2(dy, dx) // in radians

  const area = Math.PI * radius * radius
  const circumference = 2 * Math.PI * radius

  return {
    origin,
    radius,
    rotation,
    area,
    circumference,
  }
}

export function translate(circle: Circle, delta: XY): Circle {
  const transformationMatrix = createTranslation(delta)
  const multiplied = compose(transformationMatrix, circle.transformation)
  return {
    ...circle,
    transformation: multiplied,
  }
}

export function scale(circle: Circle, origin: XY, factor: XY): Ellipse {
  const transformationMatrix = createScale(origin, factor)
  const multiplied = compose(transformationMatrix, circle.transformation)
  const ellipse = createUnitEllipse(multiplied)
  return ellipse
}

export function scaleUniform(circle: Circle, origin: XY, factor: number): Circle {
  const transformationMatrix = createScale(origin, { x: factor, y: factor })
  const multiplied = compose(transformationMatrix, circle.transformation)
  return {
    ...circle,
    transformation: multiplied,
  }
}

export function rotate(circle: Circle, origin: XY, angle: number): Circle {
  const transformationMatrix = createRotation(origin, angle)
  const multiplied = compose(transformationMatrix, circle.transformation)
  return {
    ...circle,
    transformation: multiplied,
  }
}

export function skew(circle: Circle, origin: XY, factor: XY): Ellipse {
  const transformationMatrix = createSkew(origin, factor)
  const multiplied = compose(transformationMatrix, circle.transformation)
  const ellipse = createUnitEllipse(multiplied)
  return ellipse
}
