import { type XY } from './xy';
import { assertIsOfShapeKind, type BaseShape, type Shape } from './shape';
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

export function assertIsEllipticalArcShape(shape: Shape): EllipticalArcShape {
  const circleOrArc = assertIsOfShapeKind(shape, ['elliptical-arc', 'ellipse', 'circle', 'arc']);

  if (circleOrArc.kind == 'circle') {
    return {
      ...circleOrArc,
      kind: 'elliptical-arc',
      radiusX: circleOrArc.radius,
      radiusY: circleOrArc.radius,
      rotation: 0,
      startAngle: 0,
      endAngle: Math.PI * 2,
      counterclockwise: false,
    };
  }

  if (circleOrArc.kind == 'ellipse') {
    return {
      ...circleOrArc,
      kind: 'elliptical-arc',
      radiusX: circleOrArc.radiusX,
      radiusY: circleOrArc.radiusY,
      rotation: 0,
      startAngle: 0,
      endAngle: Math.PI * 2,
      counterclockwise: false,
    };
  }

  if (circleOrArc.kind == 'arc') {
    return {
      ...circleOrArc,
      kind: 'elliptical-arc',
      radiusX: circleOrArc.radius,
      radiusY: circleOrArc.radius,
      rotation: 0,
      startAngle: 0,
      endAngle: Math.PI * 2,
      counterclockwise: false,
    };
  }

  return circleOrArc;
}
