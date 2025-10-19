import type { BaseShape } from './shape';
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
