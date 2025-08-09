import type { Arc } from './arc'
import type { Circle } from './circle'
import type { Ellipse } from './ellipse'
import { type EllipticalArc, divideCurvedShape } from './elliptical-arc'
import { type Line, divideLine } from './line'
import { type Parallelogram, divideParallelogram } from './parallelogram'
import type { Rectangle } from './rectangle'
import type { Square } from './square'
import { isTransformationMatrix } from './transformation-matrix'
import type { XY } from './xy'
import { deconstruct as deconstructCircle } from './circle'
import { deconstruct as deconstructEllipse } from './ellipse'
import { deconstruct as deconstructLine } from './line'
import { deconstruct as deconstructRectangle } from './rectangle'
import { deconstruct as deconstructSquare } from './square'
import { deconstruct as deconstructParallelogram } from './parallelogram'
import { deconstruct as deconstructArc } from './arc'
import { deconstruct as deconstructEllipticalArc } from './elliptical-arc'

export const curveKinds = [
  'arc',
  'elliptical-arc',
  'circle',
  'ellipse',
  'line',
  'square',
  'rectangle',
  'parallelogram',
] as const

export type CurveKind = (typeof curveKinds)[number]

export type CurveLike =
  | Arc
  | EllipticalArc
  | Circle
  | Ellipse
  | Line
  | Square
  | Rectangle
  | Parallelogram

export function isCurveKind(value: string): value is CurveKind {
  return curveKinds.includes(value as CurveKind)
}

export function isCurveLike(value: unknown): value is CurveLike {
  return (
    typeof value === 'object' &&
    value !== null &&
    'kind' in value &&
    typeof value.kind === 'string' &&
    isCurveKind(value.kind) &&
    'transformation' in value &&
    isTransformationMatrix(value.transformation)
  )
}

export function assertIsCurveLike(value: unknown): CurveLike {
  if (!isCurveLike(value)) {
    throw new Error('Value is not a shape.')
  }

  return value
}

export function getCenter(element: CurveLike): XY {
  switch (element.kind) {
    case 'arc': {
      const { middle: midPoint } = deconstructArc(element)
      return midPoint
    }

    case 'elliptical-arc': {
      const { middle: midPoint } = deconstructEllipticalArc(element)
      return midPoint
    }

    case 'circle': {
      const { origin } = deconstructCircle(element)
      return origin
    }

    case 'ellipse': {
      const { origin } = deconstructEllipse(element)
      return origin
    }

    case 'line': {
      const { middle: center } = deconstructLine(element)
      return center
    }

    case 'rectangle': {
      const { center } = deconstructRectangle(element)
      return center
    }

    case 'square': {
      const { center } = deconstructSquare(element)
      return center
    }

    case 'parallelogram': {
      const { center } = deconstructParallelogram(element)
      return center
    }
  }
}

export function dividen(shape: CurveLike, n: number): XY[] {
  switch (shape.kind) {
    case 'arc':
    case 'elliptical-arc':
    case 'circle':
    case 'ellipse': {
      return divideCurvedShape(shape, n)
    }
    case 'line': {
      return divideLine(shape, n)
    }
    case 'square':
    case 'rectangle':
    case 'parallelogram': {
      return divideParallelogram(shape, n)
    }
  }
}
