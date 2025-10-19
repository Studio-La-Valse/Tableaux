import { type XY } from './xy';
import { assertIsOfShapeKind, type BaseShape, type Shape } from './shape';

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

export function assertIsEllipseShape(shape: Shape): EllipseShape {
  const circleOrArc = assertIsOfShapeKind(shape, ['ellipse', 'circle']);

  if (circleOrArc.kind == 'circle') {
    return {
      ...circleOrArc,
      kind: 'ellipse',
      radiusX: circleOrArc.radius,
      radiusY: circleOrArc.radius,
      rotation: 0,
    };
  }

  return circleOrArc;
}
