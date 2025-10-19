import { type XY } from './xy';
import type { BaseShape } from './shape';
import type { Ellipse } from './ellipse';
import type { TransformationMatrix } from './transformation-matrix';

export type EllipticalArc = Ellipse & {
  startAngle: number;
  endAngle: number;
  counterclockwise: boolean;
};

export type EllipticalArcShape = BaseShape & {
  kind: 'elliptical-arc';
} & EllipticalArc;

export function createEllipticalArc(
  origin: XY,
  radiusX: number,
  radiusY: number,
  rotation: number,
  startAngle: number,
  endAngle: number,
  counterclockwise: boolean = false,
  transformationMatrix?: TransformationMatrix
): EllipticalArcShape {
  return {
    kind: 'elliptical-arc',
    ...origin,
    radiusX,
    radiusY,
    rotation,
    startAngle,
    endAngle,
    counterclockwise,
    t: transformationMatrix,
  };
}
