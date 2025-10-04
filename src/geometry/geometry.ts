import type { XY } from './xy';
import {
  skew as skewXY,
  translate as translateXY,
  rotate as rotateXY,
  scale as scaleXY,
  scaleUniform as scaleUniformXY,
  isXY,
  applyMatrix,
} from './xy';

import {
  skew as skewArc,
  translate as translateArc,
  rotate as rotateArc,
  scale as scaleArc,
  scaleUniform as scaleUniformArc,
} from './arc';

import type { EllipticalArc } from './elliptical-arc';
import {
  skew as skewEllipticalArc,
  translate as translateEllipticalArc,
  rotate as rotateEllipticalArc,
  scale as scaleEllipticalArc,
  scaleUniform as scaleUniformEllipticalArc,
} from './elliptical-arc';

import {
  skew as skewCircle,
  translate as translateCircle,
  rotate as rotateCircle,
  scale as scaleCircle,
  scaleUniform as scaleUniformCircle,
} from './circle';

import type { Ellipse } from './ellipse';
import {
  translate as translateEllipse,
  rotate as rotateEllipse,
  scale as scaleEllipse,
  scaleUniform as scaleUniformEllipse,
  skew as skewEllipse,
} from './ellipse';

import type { Line } from './line';
import {
  translate as translateLine,
  rotate as rotateLine,
  scale as scaleLine,
  scaleUniform as scaleUniformLine,
  skew as skewLine,
} from './line';

import type { Parallelogram } from './parallelogram';
import {
  translate as translateParallelogram,
  rotate as rotateParallelogram,
  scale as scaleParallelogram,
  scaleUniform as scaleUniformParallelogram,
  skew as skewParallelogram,
} from './parallelogram';

import {
  translate as translateRectangle,
  rotate as rotateRectangle,
  scale as scaleRectangle,
  scaleUniform as scaleUniformRectangle,
  skew as skewRectangle,
} from './rectangle';

import {
  translate as translateSquare,
  rotate as rotateSquare,
  scale as scaleSquare,
  scaleUniform as scaleUniformSquare,
  skew as skewSquare,
} from './square';

import {
  translate as translateText,
  rotate as rotateText,
  scale as scaleText,
  scaleUniform as scaleUniformText,
  skew as skewText,
  type TextShape,
} from '../bitmap-painters/text-shape';

import { compose, type TransformationMatrix } from './transformation-matrix';
import { isShape, type Shape } from './shape';

export type Geometry = Shape | XY;

export function isGeometry(value: unknown): value is Geometry {
  return isXY(value) || isShape(value);
}

export function assertIsGeometry(value: unknown): Geometry {
  if (!isGeometry(value)) {
    throw new Error('Value is not geometry');
  }

  return value;
}

export function translate(geometry: Geometry, delta: XY): Geometry {
  if (isXY(geometry)) {
    return translateXY(geometry, delta);
  }

  switch (geometry.kind) {
    case 'arc':
      return translateArc(geometry, delta);
    case 'elliptical-arc':
      return translateEllipticalArc(geometry, delta);
    case 'circle':
      return translateCircle(geometry, delta);
    case 'ellipse':
      return translateEllipse(geometry, delta);
    case 'line':
      return translateLine(geometry, delta);
    case 'square':
      return translateSquare(geometry, delta);
    case 'rectangle':
      return translateRectangle(geometry, delta);
    case 'parallelogram':
      return translateParallelogram(geometry, delta);
    case 'text':
      return translateText(geometry, delta);
  }
}

export function rotate(
  geometry: Geometry,
  origin: XY,
  angle: number
): Geometry {
  if (isXY(geometry)) {
    return rotateXY(geometry, origin, angle);
  }

  switch (geometry.kind) {
    case 'arc':
      return rotateArc(geometry, origin, angle);
    case 'elliptical-arc':
      return rotateEllipticalArc(geometry, origin, angle);
    case 'circle':
      return rotateCircle(geometry, origin, angle);
    case 'ellipse':
      return rotateEllipse(geometry, origin, angle);
    case 'line':
      return rotateLine(geometry, origin, angle);
    case 'square':
      return rotateSquare(geometry, origin, angle);
    case 'rectangle':
      return rotateRectangle(geometry, origin, angle);
    case 'parallelogram':
      return rotateParallelogram(geometry, origin, angle);
    case 'text':
      return rotateText(geometry, origin, angle);
  }
}

export function scale(geometry: Geometry, origin: XY, factor: XY): Geometry {
  if (isXY(geometry)) {
    return scaleXY(geometry, origin, factor);
  }

  switch (geometry.kind) {
    case 'arc':
      return scaleArc(geometry, origin, factor);
    case 'elliptical-arc':
      return scaleEllipticalArc(geometry, origin, factor);
    case 'circle':
      return scaleCircle(geometry, origin, factor);
    case 'ellipse':
      return scaleEllipse(geometry, origin, factor);
    case 'line':
      return scaleLine(geometry, origin, factor);
    case 'square':
      return scaleSquare(geometry, origin, factor);
    case 'rectangle':
      return scaleRectangle(geometry, origin, factor);
    case 'parallelogram':
      return scaleParallelogram(geometry, origin, factor);
    case 'text':
      return scaleText(geometry, origin, factor);
  }
}

export function scaleUniform(
  geometry: Geometry,
  origin: XY,
  factor: number
): Geometry {
  if (isXY(geometry)) {
    return scaleUniformXY(geometry, origin, factor);
  }

  switch (geometry.kind) {
    case 'arc':
      return scaleUniformArc(geometry, origin, factor);
    case 'elliptical-arc':
      return scaleUniformEllipticalArc(geometry, origin, factor);
    case 'circle':
      return scaleUniformCircle(geometry, origin, factor);
    case 'ellipse':
      return scaleUniformEllipse(geometry, origin, factor);
    case 'line':
      return scaleUniformLine(geometry, origin, factor);
    case 'square':
      return scaleUniformSquare(geometry, origin, factor);
    case 'rectangle':
      return scaleUniformRectangle(geometry, origin, factor);
    case 'parallelogram':
      return scaleUniformParallelogram(geometry, origin, factor);
    case 'text':
      return scaleUniformText(geometry, origin, factor);
  }
}

export function skew(geometry: Geometry, origin: XY, factor: XY): Geometry {
  if (isXY(geometry)) {
    return skewXY(geometry, origin, factor);
  }

  switch (geometry.kind) {
    case 'arc':
      return skewArc(geometry, origin, factor);
    case 'elliptical-arc':
      return skewEllipticalArc(geometry, origin, factor);
    case 'circle':
      return skewCircle(geometry, origin, factor);
    case 'ellipse':
      return skewEllipse(geometry, origin, factor);
    case 'line':
      return skewLine(geometry, origin, factor);
    case 'square':
      return skewSquare(geometry, origin, factor);
    case 'rectangle':
      return skewRectangle(geometry, origin, factor);
    case 'parallelogram':
      return skewParallelogram(geometry, origin, factor);
    case 'text':
      return skewText(geometry, origin, factor);
  }
}

export function pushTransform(
  geometry: Geometry,
  transformation: TransformationMatrix
): Geometry {
  if (isXY(geometry)) {
    return applyMatrix(geometry, transformation);
  }

  const newMatrix = compose(transformation, geometry.transformation);
  switch (geometry.kind) {
    case 'arc':
    case 'elliptical-arc':
      const result: EllipticalArc = {
        ...geometry,
        kind: 'elliptical-arc',
        transformation: newMatrix,
      };
      return result;
    case 'circle':
    case 'ellipse': {
      const result: Ellipse = {
        ...geometry,
        kind: 'ellipse',
        transformation: newMatrix,
      };
      return result;
    }
    case 'line': {
      const result: Line = {
        ...geometry,
        kind: 'line',
        transformation: newMatrix,
      };
      return result;
    }
    case 'square':
    case 'rectangle':
    case 'parallelogram': {
      const result: Parallelogram = {
        ...geometry,
        kind: 'parallelogram',
        transformation: newMatrix,
      };
      return result;
    }
    case 'text': {
      const result: TextShape = {
        ...geometry,
        kind: 'text',
        transformation: newMatrix,
      };
      return result;
    }
  }
}

export function setTransform(
  geometry: Geometry,
  transformation: TransformationMatrix
): Geometry {
  if (isXY(geometry)) {
    return applyMatrix(geometry, transformation);
  }

  switch (geometry.kind) {
    case 'arc':
    case 'elliptical-arc':
      const result: EllipticalArc = {
        ...geometry,
        kind: 'elliptical-arc',
        transformation,
      };
      return result;
    case 'circle':
    case 'ellipse': {
      const result: Ellipse = {
        ...geometry,
        kind: 'ellipse',
        transformation,
      };
      return result;
    }
    case 'line': {
      const result: Line = {
        ...geometry,
        kind: 'line',
        transformation,
      };
      return result;
    }
    case 'square':
    case 'rectangle':
    case 'parallelogram': {
      const result: Parallelogram = {
        ...geometry,
        kind: 'parallelogram',
        transformation,
      };
      return result;
    }
    case 'text': {
      const result: TextShape = {
        ...geometry,
        kind: 'text',
        transformation,
      };
      return result;
    }
  }
}
