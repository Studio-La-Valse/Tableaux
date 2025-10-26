import type { JsonObject } from '@/graph/core/models/json-value';
import { isLine, type Line } from './polyline';
import { type BaseShape } from './shape';
import type { TransformationMatrix } from './transformation-matrix';
import { isXY, type XY } from './xy';

export type Quadratic = Line & {
  control: XY;
};

export function isQuadratic(object: JsonObject): object is Quadratic {
  return isLine(object) && 'control' in object && isXY(object.control);
}

export function asQuadratic(object: JsonObject): Quadratic {
  if (isQuadratic(object)) {
    return {
      ...object,
    };
  }

  throw Error('Object could not be cast to a quadratic');
}

// Quadratic Bézier: start → control → end
export type QuadraticShape = BaseShape &
  Quadratic & {
    kind: 'quadratic';
  };

export function createQuadratic(
  start: XY,
  control: XY,
  end: XY,
  t?: TransformationMatrix
): QuadraticShape {
  return {
    kind: 'quadratic',
    start,
    control,
    end,
    t,
  };
}
