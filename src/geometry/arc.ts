import { type XY } from './xy';
import type { BaseShape } from './shape';
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
  transformationMatrix?: TransformationMatrix
): ArcShape {
  return {
    kind: 'arc',
    ...origin,
    radius,
    startAngle,
    endAngle,
    counterclockwise,
    t: transformationMatrix,
  };
}
