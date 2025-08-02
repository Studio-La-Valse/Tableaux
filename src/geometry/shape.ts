import type { Arc } from './arc'
import { divideCurvedShape, type EllipticalArc } from './elliptical-arc'
import type { Circle } from './circle'
import type { Ellipse } from './ellipse'
import { divideLine, type Line } from './line'
import { divideParallelogram, type Parallelogram } from './parallelogram'
import type { Rectangle } from './rectangle'
import type { Square } from './square'
import { isTransformationMatrix, type TransformationMatrix } from './transformation-matrix'
import type { XY } from './xy'

export const shapeKinds = [
  'arc',
  'elliptical-arc',
  'circle',
  'ellipse',
  'line',
  'square',
  'rectangle',
  'parallelogram',
] as const

export type ShapeKind = (typeof shapeKinds)[number]

export type BaseShape = {
  kind: ShapeKind
  transformation: TransformationMatrix
}

export type Shape =
  | Arc
  | EllipticalArc
  | Circle
  | Ellipse
  | Line
  | Square
  | Rectangle
  | Parallelogram

export function isShape(value: unknown): value is Shape {
  return (
    typeof value === 'object' &&
    value !== null &&
    'kind' in value &&
    typeof value.kind === 'string' &&
    isShapeKind(value.kind) &&
    'transformation' in value &&
    isTransformationMatrix(value.transformation)
  )
}

export function isShapeKind(value: string): value is ShapeKind {
  return shapeKinds.includes(value as ShapeKind)
}

export function isOfShapeKind<K extends Shape['kind']>(
  geom: Shape,
  allowedKinds: K[],
): geom is Extract<Shape, { kind: K }> {
  return allowedKinds.includes(geom.kind as K)
}

export function assertIsShape(value: unknown): Shape {
  if (!isShape(value)) {
    throw new Error('Value is not a shape.')
  }

  return value
}

export function dividen(shape: Shape, n: number): XY[] {
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
