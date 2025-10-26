import type { JsonObject } from '@/graph/core/models/json-value';
import { isRectangle, rectangleAsPolyline } from './rectangle';
import { type BaseShape } from './shape';
import type { TransformationMatrix } from './transformation-matrix';
import { isXY, type XY } from './xy';

export type Line = { start: XY; end: XY };

export function isLine(object: JsonObject): object is Line {
  return 'start' in object && isXY(object.start) && 'end' in object && isXY(object.end);
}

export function asLine(object: JsonObject): Line {
  if (isLine(object)) {
    return {
      ...object,
    };
  }

  throw Error('Object could not be cast to line');
}

export function lineAsPolyline(line: Line): Polyline {
  return {
    ...line,
    points: [],
  };
}

export type Polyline = { start: XY; points: XY[]; end: XY };
export type PolylineShape = BaseShape & { kind: 'polyline' } & Polyline;

export function isPolyline(object: JsonObject): object is Polyline {
  return isLine(object) && 'points' in object && Array.isArray(object.points);
}

export function asPolyline(object: JsonObject): Polyline {
  if (isPolyline(object)) {
    return {
      ...object,
    };
  }

  if (isLine(object)) {
    return lineAsPolyline(object);
  }

  if (isRectangle(object)) {
    return rectangleAsPolyline(object);
  }

  throw Error('Object could not be cast to a polyline.');
}

export function createPolyline(
  start: XY,
  end: XY,
  transformation?: TransformationMatrix,
  ...points: XY[]
): PolylineShape {
  const line: PolylineShape = {
    kind: 'polyline',
    start,
    points,
    end,
    t: transformation,
  };

  return line;
}
