import { type XY } from './xy';
import { type BaseShape } from './shape';
import { circleAsArc, isCircle, type Circle } from './circle';
import type { TransformationMatrix } from './transformation-matrix';
import type { JsonObject } from '@/graph/core/models/json-value';
import type { EllipticalArc } from './elliptical-arc';

export type Arc = Circle & {
  startAngle: number;
  endAngle: number;
  counterclockwise: boolean;
};

export function isArc(object: JsonObject): object is Arc {
  return (
    isCircle(object) &&
    'startAngle' in object &&
    typeof object.startAngle === 'number' &&
    'endAngle' in object &&
    typeof object.endAngle === 'number' &&
    'counterclockwise' in object &&
    typeof object.counterclockwise === 'boolean'
  );
}

export function asArc(object: JsonObject): Arc {
  if (isArc(object)) {
    return {
      ...object,
    };
  }

  if (isCircle(object)) {
    return circleAsArc(object);
  }

  throw Error('This object could not be cast to an arc shape.');
}

export function arcAsEllipticalArc(arc: Arc): EllipticalArc {
  return {
    ...arc,
    radiusX: arc.radius,
    radiusY: arc.radius,
    rotation: 0,
  };
}

export type ArcShape = BaseShape & {
  kind: 'arc';
} & Arc;

export function createArc(
  origin: XY,
  radius: number,
  startAngle: number,
  endAngle: number,
  counterclockwise: boolean = false,
  t?: TransformationMatrix
): ArcShape {
  return {
    kind: 'arc',
    ...origin,
    radius,
    startAngle,
    endAngle,
    counterclockwise,
    t,
  };
}
