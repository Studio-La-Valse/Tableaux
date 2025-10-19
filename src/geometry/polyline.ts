import { assertIsOfShapeKind, type BaseShape, type Shape } from './shape';
import type { TransformationMatrix } from './transformation-matrix';
import { type XY } from './xy';

export type Polyline = { start: XY; points: XY[]; end: XY };
export type PolylineShape = BaseShape & { kind: 'polyline' } & Polyline;

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

export function assertIsPolyline(shape: Shape): PolylineShape {
  const circleOrArc = assertIsOfShapeKind(shape, ['polyline', 'rectangle']);

  if (circleOrArc.kind == 'rectangle') {
    const { x, y, width, height } = circleOrArc;
    return {
      ...circleOrArc,
      kind: 'polyline',
      start: { x, y },
      end: { x, y },
      points: [
        { x: x + width, y },
        { x: x + width, y: y + height },
        { x, y: y + height },
      ],
    };
  }

  return circleOrArc;
}
