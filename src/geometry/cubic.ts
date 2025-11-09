import type { JsonObject } from '@/graph/core/models/json-value';
import { type BaseShape } from './shape';
import type { TransformationMatrix } from './transformation-matrix';
import { isXY, type XY } from './xy';
import { isLine, type Line } from './polyline';

export type Cubic = Line & {
  control1: XY;
  control2: XY;
};

export function isCubic(object: JsonObject): object is Cubic {
  return (
    isLine(object) &&
    'control1' in object &&
    isXY(object.control1) &&
    'control2' in object &&
    isXY(object.control2)
  );
}

export function asCubic(object: JsonObject): Cubic {
  if (isCubic(object)) {
    return {
      ...object,
    };
  }

  throw Error('Object could not be cast to a cubic');
}

// Cubic Bézier: start → control1 → control2 → end
export type CubicShape = BaseShape & {
  kind: 'cubic';
} & Cubic;

export function createCubic(
  start: XY,
  control1: XY,
  control2: XY,
  end: XY,
  t?: TransformationMatrix,
): CubicShape {
  return {
    kind: 'cubic',
    start,
    control1,
    control2,
    end,
    t,
  };
}
