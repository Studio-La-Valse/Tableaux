import { assertIsOfShapeKind, type BaseShape, type Shape } from './shape';
import type { TransformationMatrix } from './transformation-matrix';
import type { XY } from './xy';

// Quadratic Bézier: start → control → end
export type QuadraticShape = BaseShape & {
  kind: 'quadratic';
  start: XY;
  control: XY;
  end: XY;
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
