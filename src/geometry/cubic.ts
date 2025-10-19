import { assertIsOfShapeKind, type BaseShape, type Shape } from './shape';
import type { TransformationMatrix } from './transformation-matrix';
import type { XY } from './xy';

// Cubic Bézier: start → control1 → control2 → end
export type CubicShape = BaseShape & {
  kind: 'cubic';
  start: XY;
  control1: XY;
  control2: XY;
  end: XY;
};

export function createCubic(
  start: XY,
  control1: XY,
  control2: XY,
  end: XY,
  t?: TransformationMatrix
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

export function assertIsCubicShape(shape: Shape): CubicShape {
  const circleOrArc = assertIsOfShapeKind(shape, ['cubic']);
  return circleOrArc;
}
