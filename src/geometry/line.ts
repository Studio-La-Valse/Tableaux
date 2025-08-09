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
import { isOfShapeKind, type BaseShape } from './shape'
import type { Arc } from './arc'
import { deconstruct as deconstructEllipticalArc, type EllipticalArc } from './elliptical-arc'

export type Line = BaseShape & { kind: 'line' }

export const IDENTITY_START: XY = { x: 0, y: 0 }
export const IDENTITY_END: XY = { x: 1, y: 0 }

export function createUnitLine(): Line {
  return createLine(IDENTITY_START, IDENTITY_END)
}

export function createLine(start: XY, end: XY): Line {
  const dx = end.x - start.x
  const dy = end.y - start.y

  // Length of the new line
  const length = Math.sqrt(dx * dx + dy * dy)

  // Angle of rotation in radians
  const angle = Math.atan2(dy, dx)

  // Transformation matrix to rotate, scale, and translate the unit line
  const transformation: TransformationMatrix = {
    a: Math.cos(angle) * length,
    b: Math.sin(angle) * length,
    c: -Math.sin(angle) * length,
    d: Math.cos(angle) * length,
    e: start.x,
    f: start.y,
  }

  return createTransformedLine(transformation)
}

export function createTransformedLine(transformation: TransformationMatrix = identity()): Line {
  return { kind: 'line', transformation }
}

export type DeconstructedLine = {
  start: XY
  middle: XY
  end: XY
  length: number
}

export function deconstruct(line: Line | Arc | EllipticalArc): DeconstructedLine {
  if (isOfShapeKind(line, ['arc', 'elliptical-arc'])) {
    const { start, middle, end, length } = deconstructEllipticalArc(line)
    return {
      start,
      middle,
      end,
      length,
    }
  } else {
    const start = applyMatrix(IDENTITY_START, line.transformation)
    const end = applyMatrix(IDENTITY_END, line.transformation)
    const middle = {
      x: (start.x + end.x) / 2,
      y: (start.y + end.y) / 2,
    }
    const length = distance(start, end)
    return {
      start,
      middle,
      end,
      length,
    }
  }
}

export function translate(line: Line, delta: XY): Line {
  const transformationMatrix = createTranslation(delta)
  const transformation = compose(transformationMatrix, line.transformation)
  return {
    ...line,
    transformation,
  }
}

export function scale(line: Line, origin: XY, factor: XY): Line {
  const transformationMatrix = createScale(origin, factor)
  const transformation = compose(transformationMatrix, line.transformation)
  return {
    ...line,
    transformation,
  }
}

export function scaleUniform(line: Line, origin: XY, factor: number): Line {
  const transformationMatrix = createScale(origin, { x: factor, y: factor })
  const transformation = compose(transformationMatrix, line.transformation)
  return {
    ...line,
    transformation,
  }
}

export function rotate(line: Line, origin: XY, angle: number): Line {
  const transformationMatrix = createRotation(origin, angle)
  const transformation = compose(transformationMatrix, line.transformation)
  return {
    ...line,
    transformation,
  }
}

export function skew(line: Line, origin: XY, factor: XY): Line {
  const transformationMatrix = createSkew(origin, factor)
  const transformation = compose(transformationMatrix, line.transformation)
  return {
    ...line,
    transformation,
  }
}

export function divideLine(shape: Line, n: number): XY[] {
  const start = applyMatrix({ x: 0, y: 0 }, shape.transformation)
  const end = applyMatrix({ x: 1, y: 0 }, shape.transformation)

  const points: XY[] = []
  for (let i = 0; i < n; i++) {
    const t = i / n
    points.push(interpolate(start, end, t))
  }
  return points
}
