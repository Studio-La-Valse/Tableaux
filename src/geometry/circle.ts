import { type XY } from './xy';
import { assertIsOfShapeKind, type BaseShape, type Shape } from './shape';

export type Circle = { x: number; y: number; radius: number };
export type CircleShape = BaseShape & { kind: 'circle' } & Circle;

export function createCircle(origin: XY, radius: number): CircleShape {
  const circle: CircleShape = {
    kind: 'circle',
    ...origin,
    radius,
  };
  return circle;
}

export function assertIsCircleShape(shape: Shape): CircleShape {
  const circleOrArc = assertIsOfShapeKind(shape, ['circle']);
  return circleOrArc;
}
