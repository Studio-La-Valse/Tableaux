import type { XY } from './xy'
import {
  skew as skewXY,
  translate as translateXY,
  rotate as rotateXY,
  scale as scaleXY,
  scaleUniform as scaleUniformXY,
  isXY,
  applyMatrix,
} from './xy'

import type { Circle } from './circle'
import {
  skew as skewCircle,
  translate as translateCircle,
  rotate as rotateCircle,
  scale as scaleCircle,
  scaleUniform as scaleUniformCircle,
} from './circle'

import type { Ellipse } from './ellipse'
import {
  translate as translateEllipse,
  rotate as rotateEllipse,
  scale as scaleEllipse,
  scaleUniform as scaleUniformEllipse,
  skew as skewEllipse,
} from './ellipse'

import type { Line } from './line'
import {
  translate as translateLine,
  rotate as rotateLine,
  scale as scaleLine,
  scaleUniform as scaleUniformLine,
  skew as skewLine,
} from './line'

import type { Parallelogram } from './parallelogram'
import {
  translate as translateParallelogram,
  rotate as rotateParallelogram,
  scale as scaleParallelogram,
  scaleUniform as scaleUniformParallelogram,
  skew as skewParallelogram,
} from './parallelogram'

import type { Rectangle } from './rectangle'
import {
  translate as translateRectangle,
  rotate as rotateRectangle,
  scale as scaleRectangle,
  scaleUniform as scaleUniformRectangle,
  skew as skewRectangle,
} from './rectangle'

import type { Square } from './square'
import {
  translate as translateSquare,
  rotate as rotateSquare,
  scale as scaleSquare,
  scaleUniform as scaleUniformSquare,
  skew as skewSquare,
} from './square'
import { deconstruct as deconstructCircle } from './circle'
import { deconstruct as deconstructEllipse } from './ellipse'
import { deconstruct as deconstructLine } from './line'
import { deconstruct as deconstructRectangle } from './rectangle'
import { deconstruct as deconstructSquare } from './square'
import { deconstruct as deconstructParallelogram } from './parallelogram'

import { compose, isTransformationMatrix, type TransformationMatrix } from './transformation-matrix'

export type ShapeKind = 'circle' | 'ellipse' | 'line' | 'square' | 'rectangle' | 'parallelogram'

export type BaseShape = {
  kind: ShapeKind
  transformation: TransformationMatrix
}

export type Shape = Circle | Ellipse | Line | Square | Rectangle | Parallelogram

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
  return ['circle', 'ellipse', 'line', 'square', 'rectangle', 'parallelogram'].includes(value)
}

export function assertIsShape(value: unknown): Shape {
  if (!isShape(value)) {
    throw new Error('Value is not a shape.')
  }

  return value
}

export type Geometry = Shape | XY

export function isGeometry(value: unknown): value is Geometry {
  return isXY(value) || isShape(value)
}

export function assertIsGeometry(value: unknown): Geometry {
  if (!isGeometry(value)) {
    throw new Error('Value is not geometry')
  }

  return value
}

export function translate(geometry: Geometry, delta: XY): Geometry {
  if (isXY(geometry)) {
    return translateXY(geometry, delta)
  }

  switch (geometry.kind) {
    case 'circle':
      return translateCircle(geometry, delta)
    case 'ellipse':
      return translateEllipse(geometry, delta)
    case 'line':
      return translateLine(geometry, delta)
    case 'square':
      return translateSquare(geometry, delta)
    case 'rectangle':
      return translateRectangle(geometry, delta)
    case 'parallelogram':
      return translateParallelogram(geometry, delta)
    default:
      throw new Error('Unsupported Geometry type')
  }
}

export function rotate(geometry: Geometry, origin: XY, angle: number): Geometry {
  if (isXY(geometry)) {
    return rotateXY(geometry, origin, angle)
  }

  switch (geometry.kind) {
    case 'circle':
      return rotateCircle(geometry, origin, angle)
    case 'ellipse':
      return rotateEllipse(geometry, origin, angle)
    case 'line':
      return rotateLine(geometry, origin, angle)
    case 'square':
      return rotateSquare(geometry, origin, angle)
    case 'rectangle':
      return rotateRectangle(geometry, origin, angle)
    case 'parallelogram':
      return rotateParallelogram(geometry, origin, angle)
    default:
      throw new Error('Unsupported Geometry type')
  }
}

export function scale(geometry: Geometry, origin: XY, factor: XY): Geometry {
  if (isXY(geometry)) {
    return scaleXY(geometry, origin, factor)
  }

  switch (geometry.kind) {
    case 'circle':
      return scaleCircle(geometry, origin, factor)
    case 'ellipse':
      return scaleEllipse(geometry, origin, factor)
    case 'line':
      return scaleLine(geometry, origin, factor)
    case 'square':
      return scaleSquare(geometry, origin, factor)
    case 'rectangle':
      return scaleRectangle(geometry, origin, factor)
    case 'parallelogram':
      return scaleParallelogram(geometry, origin, factor)
    default:
      throw new Error('Unsupported Geometry type')
  }
}

export function scaleUniform(geometry: Geometry, origin: XY, factor: number): Geometry {
  if (isXY(geometry)) {
    return scaleUniformXY(geometry, origin, factor)
  }

  switch (geometry.kind) {
    case 'circle':
      return scaleUniformCircle(geometry, origin, factor)
    case 'ellipse':
      return scaleUniformEllipse(geometry, origin, factor)
    case 'line':
      return scaleUniformLine(geometry, origin, factor)
    case 'square':
      return scaleUniformSquare(geometry, origin, factor)
    case 'rectangle':
      return scaleUniformRectangle(geometry, origin, factor)
    case 'parallelogram':
      return scaleUniformParallelogram(geometry, origin, factor)
    default:
      throw new Error('Unsupported Geometry type')
  }
}

export function skew(geometry: Geometry, origin: XY, factor: XY): Geometry {
  if (isXY(geometry)) {
    return skewXY(geometry, origin, factor)
  }

  switch (geometry.kind) {
    case 'circle':
      return skewCircle(geometry, origin, factor)
    case 'ellipse':
      return skewEllipse(geometry, origin, factor)
    case 'line':
      return skewLine(geometry, origin, factor)
    case 'square':
      return skewSquare(geometry, origin, factor)
    case 'rectangle':
      return skewRectangle(geometry, origin, factor)
    case 'parallelogram':
      return skewParallelogram(geometry, origin, factor)
    default:
      throw new Error('Unsupported Geometry type')
  }
}

export function transform(geometry: Geometry, transformation: TransformationMatrix): Geometry {
  if (isXY(geometry)) {
    return applyMatrix(geometry, transformation)
  }

  const newMatrix = compose(transformation, geometry.transformation)
  switch (geometry.kind) {
    case 'circle':
    case 'ellipse': {
      const result: Ellipse = {
        kind: 'ellipse',
        transformation: newMatrix,
      }
      return result
    }
    case 'line': {
      const result: Line = {
        kind: 'line',
        transformation: newMatrix,
      }
      return result
    }
    case 'square':
    case 'rectangle':
    case 'parallelogram': {
      const result: Parallelogram = {
        kind: 'parallelogram',
        transformation: newMatrix,
      }
      return result
    }
    default:
      throw new Error('Unsupported Geometry type')
  }
}

export function getCenter(element: Geometry): XY {
  if (isXY(element)) {
    return { x: element.x, y: element.y }
  }

  switch (element.kind) {
    case 'circle': {
      const { origin } = deconstructCircle(element)
      return origin
    }

    case 'ellipse': {
      const { origin } = deconstructEllipse(element)
      return origin
    }

    case 'line': {
      const { center } = deconstructLine(element)
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

    default:
      throw new Error('Unsupported Geometry type')
  }
}
