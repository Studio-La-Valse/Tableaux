import {
  compose,
  createRotation,
  createScale,
  createSkew,
  createTranslation,
  type TransformationMatrix,
} from './transformation-matrix'
import { applyMatrix, pointOnTransformedCircle, type XY } from './xy'
import type { BaseShape } from './geometry'
import type { Arc } from './arc'
import { IDENTITY_ORIGIN, IDENTITY_RADIUS, type Circle } from './circle'
import type { Ellipse } from './ellipse'

export type EllipticalArc = BaseShape & {
  kind: 'elliptical-arc'
  startAngle: number // radians
  endAngle: number // radians
  clockwise?: boolean
}

export const DEFAULT_START_ANGLE = 0
export const DEFAULT_END_ANGLE = Math.PI / 2

export function unitArc(): EllipticalArc {
  return createEllipticalArc(
    IDENTITY_ORIGIN,
    { x: IDENTITY_RADIUS, y: IDENTITY_RADIUS },
    DEFAULT_START_ANGLE,
    DEFAULT_END_ANGLE,
  )
}

export function createEllipticalArc(
  origin: XY,
  radii: XY,
  startAngle: number,
  endAngle: number,
  clockwise = false,
): EllipticalArc {
  const transformation: TransformationMatrix = {
    a: radii.x,
    b: 0,
    c: 0,
    d: radii.y,
    e: origin.x,
    f: origin.y,
  }

  return {
    kind: 'elliptical-arc',
    transformation,
    startAngle,
    endAngle,
    clockwise,
  }
}

export type DeconstructedEllipticalArc = {
  origin: XY
  radii: XY
  rotation: number
  startAngle: number
  endAngle: number
  clockwise: boolean
  length: number
  start: XY
  end: XY
  middle: XY
}

export function deconstructEllipticalArc(
  arc: EllipticalArc | Arc | Circle | Ellipse,
): DeconstructedEllipticalArc {
  let clockwise: boolean | undefined
  let startAngle = 0
  let endAngle = Math.PI * 2
  switch (arc.kind) {
    case 'arc':
    case 'elliptical-arc':
      clockwise = arc.clockwise
      startAngle = arc.startAngle
      endAngle = arc.endAngle
  }

  const matrix = arc.transformation
  const origin = applyMatrix(IDENTITY_ORIGIN, matrix)
  const xAxis = applyMatrix({ x: 1, y: 0 }, matrix)
  const yAxis = applyMatrix({ x: 0, y: 1 }, matrix)

  const radiusX = Math.hypot(xAxis.x - origin.x, xAxis.y - origin.y)
  const radiusY = Math.hypot(yAxis.x - origin.x, yAxis.y - origin.y)

  const dx = xAxis.x - origin.x
  const dy = xAxis.y - origin.y
  const rotation = Math.atan2(dy, dx)

  const angleDiff = clockwise
    ? (startAngle - endAngle + 2 * Math.PI) % (2 * Math.PI)
    : (endAngle - startAngle + 2 * Math.PI) % (2 * Math.PI)

  // Approximate elliptical arc length using Ramanujan's formula
  const h = Math.pow(radiusX - radiusY, 2) / Math.pow(radiusX + radiusY, 2)
  const circumference = Math.PI * (radiusX + radiusY) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)))
  const arcLength = circumference * (angleDiff / (2 * Math.PI))

  const midAngle = clockwise ? startAngle - angleDiff / 2 : startAngle + angleDiff / 2

  const startPoint = pointOnTransformedCircle(matrix, startAngle)
  const endPoint = pointOnTransformedCircle(matrix, endAngle)
  const midPoint = pointOnTransformedCircle(matrix, midAngle)

  return {
    origin,
    radii: { x: radiusX, y: radiusY },
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

export function translate(arc: EllipticalArc, delta: XY): EllipticalArc {
  const transformationMatrix = createTranslation(delta)
  const multiplied = compose(transformationMatrix, arc.transformation)
  return {
    ...arc,
    transformation: multiplied,
  }
}

export function scale(arc: EllipticalArc, origin: XY, factor: XY): EllipticalArc {
  const transformationMatrix = createScale(origin, { x: factor.x, y: factor.y })
  const multiplied = compose(transformationMatrix, arc.transformation)
  return {
    ...arc,
    transformation: multiplied,
  }
}

export function scaleUniform(arc: EllipticalArc, origin: XY, factor: number): EllipticalArc {
  const transformationMatrix = createScale(origin, { x: factor, y: factor })
  const multiplied = compose(transformationMatrix, arc.transformation)
  return {
    ...arc,
    transformation: multiplied,
  }
}

export function rotate(arc: EllipticalArc, origin: XY, angle: number): EllipticalArc {
  const transformationMatrix = createRotation(origin, angle)
  const multiplied = compose(transformationMatrix, arc.transformation)
  return {
    ...arc,
    transformation: multiplied,
  }
}

export function skew(arc: EllipticalArc, origin: XY, factor: XY): EllipticalArc {
  const transformationMatrix = createSkew(origin, factor)
  const multiplied = compose(transformationMatrix, arc.transformation)
  return {
    ...arc,
    transformation: multiplied,
  }
}
