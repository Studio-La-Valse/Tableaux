import {
  compose,
  createRotation,
  createScale,
  createSkew,
  createTranslation,
  type TransformationMatrix,
} from './transformation-matrix'
import { applyMatrix, pointOnTransformedCircle, type XY } from './xy'
import type { EllipticalArc } from './elliptical-arc'
import { IDENTITY_ORIGIN, IDENTITY_RADIUS, type Circle } from './circle'
import type { BaseShape } from './shape'

export type Arc = BaseShape & {
  kind: 'arc'
  startAngle: number // radians
  endAngle: number // radians
  clockwise?: boolean
}

export const DEFAULT_START_ANGLE = 0
export const DEFAULT_END_ANGLE = Math.PI / 2

export function unitArc(): Arc {
  return createArc(IDENTITY_ORIGIN, IDENTITY_RADIUS, DEFAULT_START_ANGLE, DEFAULT_END_ANGLE)
}

export function createArc(
  origin: XY,
  radius: number,
  startAngle: number,
  endAngle: number,
  clockwise = false,
): Arc {
  const transformation: TransformationMatrix = {
    a: radius,
    b: 0,
    c: 0,
    d: radius,
    e: origin.x,
    f: origin.y,
  }

  return {
    kind: 'arc',
    transformation,
    startAngle,
    endAngle,
    clockwise,
  }
}

export type DeconstructedArc = {
  origin: XY
  radius: number
  rotation: number
  startAngle: number
  endAngle: number
  clockwise: boolean
  length: number
  start: XY
  end: XY
  middle: XY
}

export function deconstructArc(arc: Arc | Circle): DeconstructedArc {
  let clockwise: boolean | undefined
  let startAngle = 0
  let endAngle = Math.PI * 2
  switch (arc.kind) {
    case 'arc':
      clockwise = arc.clockwise
      startAngle = arc.startAngle
      endAngle = arc.endAngle
  }

  const matrix2d = arc.transformation
  const origin = applyMatrix(IDENTITY_ORIGIN, matrix2d)
  const rightPoint = applyMatrix({ x: 1, y: 0 }, matrix2d)

  const dx = rightPoint.x - origin.x
  const dy = rightPoint.y - origin.y
  const radius = Math.hypot(dx, dy)
  const rotation = Math.atan2(dy, dx)

  const angleDiff = clockwise
    ? (startAngle - endAngle + 2 * Math.PI) % (2 * Math.PI)
    : (endAngle - startAngle + 2 * Math.PI) % (2 * Math.PI)

  const arcLength = radius * angleDiff

  const midAngle = clockwise ? startAngle - angleDiff / 2 : startAngle + angleDiff / 2

  const startPoint = pointOnTransformedCircle(matrix2d, startAngle)
  const endPoint = pointOnTransformedCircle(matrix2d, endAngle)
  const midPoint = pointOnTransformedCircle(matrix2d, midAngle)

  return {
    origin,
    radius,
    rotation,
    startAngle,
    endAngle,
    clockwise: clockwise ?? false,
    length: arcLength,
    start: startPoint,
    end: endPoint,
    middle: midPoint,
  }
}

export function translate(arc: Arc, delta: XY): Arc {
  const transformationMatrix = createTranslation(delta)
  const multiplied = compose(transformationMatrix, arc.transformation)
  return {
    ...arc,
    transformation: multiplied,
  }
}

export function scaleUniform(arc: Arc, origin: XY, factor: number): Arc {
  const transformationMatrix = createScale(origin, { x: factor, y: factor })
  const multiplied = compose(transformationMatrix, arc.transformation)
  return {
    ...arc,
    transformation: multiplied,
  }
}

export function scale(arc: Arc, origin: XY, factor: XY): EllipticalArc {
  const transformationMatrix = createScale(origin, { x: factor.x, y: factor.y })
  const multiplied = compose(transformationMatrix, arc.transformation)
  return {
    ...arc,
    kind: 'elliptical-arc',
    transformation: multiplied,
  }
}

export function rotate(arc: Arc, origin: XY, angle: number): Arc {
  const transformationMatrix = createRotation(origin, angle)
  const multiplied = compose(transformationMatrix, arc.transformation)
  return {
    ...arc,
    transformation: multiplied,
  }
}

export function skew(arc: Arc, origin: XY, factor: XY): EllipticalArc {
  const transformationMatrix = createSkew(origin, factor)
  const multiplied = compose(transformationMatrix, arc.transformation)
  return {
    ...arc,
    kind: 'elliptical-arc',
    transformation: multiplied,
  }
}
