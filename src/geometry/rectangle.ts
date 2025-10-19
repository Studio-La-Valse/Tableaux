import { type XY } from './xy';
import { assertIsOfShapeKind, type BaseShape, type Shape } from './shape';

export type Rectangle = {
  x: number;
  y: number;
  width: number;
  height: number;
  radii?: number | number[];
};
export type RectangleShape = BaseShape & { kind: 'rectangle' } & Rectangle;

export function createRectangle(
  topLeft: XY,
  width: number,
  height: number,
  radii?: number | number[]
): RectangleShape {
  return {
    kind: 'rectangle',
    ...topLeft,
    width,
    height,
    radii,
  };
}

export function assertIsRectangleShape(shape: Shape): RectangleShape {
  const circleOrArc = assertIsOfShapeKind(shape, ['rectangle']);
  return circleOrArc;
}
