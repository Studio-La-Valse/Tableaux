import { type XY } from './xy';
import { type BaseShape } from './shape';
import type { Polyline } from './polyline';
import type { JsonObject } from '@/graph/core/models/json-value';

export type Rectangle = {
  x: number;
  y: number;
  width: number;
  height: number;
  radii?: number | number[];
};

export function isRectangle(object: object): object is Rectangle {
  return (
    'x' in object &&
    typeof object.x === 'number' &&
    'y' in object &&
    typeof object.y === 'number' &&
    'width' in object &&
    typeof object.width === 'number' &&
    'height' in object &&
    typeof object.height === 'number'
  );
}

export function asRectangle(shape: JsonObject): Rectangle {
  if (isRectangle(shape)) {
    return {
      ...shape,
    };
  }

  throw Error('Provided value could not be cast to a rectangle');
}

export function rectangleAsPolyline(rectangle: Rectangle): Polyline {
  const { x, y, width, height } = rectangle;
  return {
    ...rectangle,
    start: { x, y },
    end: { x, y },
    points: [
      { x: x + width, y },
      { x: x + width, y: y + height },
      { x, y: y + height },
    ],
  };
}

export type RectangleShape = BaseShape & { kind: 'rectangle' } & Rectangle;

export function createRectangleShape(
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
