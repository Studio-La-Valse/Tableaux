import { type XY } from './xy';
import { type BaseShape } from './shape';
import type { JsonObject } from '@/graph/core/models/json-value';
import type { EllipticalArc } from './elliptical-arc';

export type Ellipse = {
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
  rotation: number;
};

export function isEllipse(object: object): object is Ellipse {
  return (
    'x' in object &&
    typeof object.x === 'number' &&
    'y' in object &&
    typeof object.y === 'number' &&
    'radiusX' in object &&
    typeof object.radiusX === 'number' &&
    'radiusY' in object &&
    typeof object.radiusY === 'number' &&
    'rotation' in object &&
    typeof object.rotation === 'number'
  );
}

export function asEllipse(object: JsonObject): Ellipse {
  if (!isEllipse(object)) {
    throw Error('Object could not be cast to an ellipse');
  }

  return {
    ...object,
  };
}

export function ellipseAsEllipticalArc(ellipse: Ellipse): EllipticalArc {
  return {
    ...ellipse,
    radiusX: ellipse.radiusX,
    radiusY: ellipse.radiusY,
    rotation: 0,
    startAngle: 0,
    endAngle: Math.PI * 2,
    counterclockwise: false,
  };
}

export type EllipseShape = BaseShape & { kind: 'ellipse' } & Ellipse;

export function createEllipseShape(
  origin: XY,
  radiusX: number,
  radiusY: number,
  rotation: number
): EllipseShape {
  return {
    ...origin,
    kind: 'ellipse',
    radiusX,
    radiusY,
    rotation,
  };
}
