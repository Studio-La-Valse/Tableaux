import { type XY } from './xy';
import type { BaseShape } from './shape';
import { createPolyline, type PolylineShape } from './polyline';
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

export function toPolyline(rectangle: RectangleShape): PolylineShape {
  const { x, y, width, height } = rectangle;
  return createPolyline(
    { x, y },
    { x, y },
    rectangle.t,
    { x: x + width, y },
    { x: x + width, y: y + height },
    { x, y: y + height }
  );
}
