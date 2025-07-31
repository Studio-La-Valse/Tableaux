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

import { type TransformationMatrix } from './transformation-matrix'
import type { XY } from './xy'

export type ShapeKind = 'circle' | 'ellipse' | 'line' | 'square' | 'rectangle' | 'parallelogram'

export type BaseShape = {
  kind: ShapeKind
  transformation: TransformationMatrix
}

export type Geometry = Circle | Ellipse | Line | Square | Rectangle | Parallelogram

export function translate(geometry: Geometry, delta: XY): Geometry {
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
      throw new Error('Skew not supported for this Geometry type')
  }
}

export function getCenter(element: Geometry): XY {
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
