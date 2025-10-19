import { type XY } from './xy';
import type { BaseShape } from './shape';

export type Ellipse = {
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
  rotation: number;
};
export type EllipseShape = BaseShape & { kind: 'ellipse' } & Ellipse;

export function createEllipse(
  origin: XY,
  radiusX: number,
  radiusY: number,
  rotation: number
): EllipseShape {
  return {
    ...origin,
    kind: 'ellipse',
    radiusX,
    radiusY,
    rotation,
  };
}
