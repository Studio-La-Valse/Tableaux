import { assertIsOfShapeKind, type BaseShape, type Shape } from './shape';
import type { TransformationMatrix } from './transformation-matrix';
import { isXY, type XY } from './xy';

export type Quadratic = {
  start: XY;
  control: XY;
  end: XY;
};

export function isQuadratic(object: object): object is Quadratic {
  return (
    'start' in object &&
    isXY(object.start) &&
    'control' in object &&
    isXY(object.control) &&
    'end' in object &&
    isXY(object.end)
  );
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

export function assertIsQuadraticShape(shape: Shape): QuadraticShape {
  const circleOrArc = assertIsOfShapeKind(shape, ['quadratic']);
  return circleOrArc;
}

export function asQuadraticShape(object: object): QuadraticShape {
  if (!isQuadratic(object)) {
    throw Error('Object could not be cast to a quadratic');
  }

  return {
    ...object,
    kind: 'quadratic',
  };
}
