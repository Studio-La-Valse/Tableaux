import { type XY } from './xy';
import { assertIsOfShapeKind, type BaseShape, type Shape } from './shape';
import type { Circle } from './circle';
import type { TransformationMatrix } from './transformation-matrix';

export type Arc = Circle & {
  startAngle: number;
  endAngle: number;
  counterclockwise: boolean;
};

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

export function assertIsArcShape(shape: Shape): ArcShape {
  const circleOrArc = assertIsOfShapeKind(shape, ['arc', 'circle']);

  if (circleOrArc.kind == 'circle') {
    return {
      ...circleOrArc,
      kind: 'arc',
      startAngle: 0,
      endAngle: Math.PI * 2,
      counterclockwise: false,
    };
  }

  return circleOrArc;
}
