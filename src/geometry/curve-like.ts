import { assertIsArcShape, type ArcShape } from './arc';
import type { CubicShape } from './cubic';
import { assertIsEllipticalArcShape, type EllipticalArcShape } from './elliptical-arc';
import { assertIsPolyline, type PolylineShape } from './polyline';
import type { QuadraticShape } from './quadratic';
import { assertIsShape, type Shape } from './shape';
import { identity } from './transformation-matrix';
import { applyMatrix, distance, type XY } from './xy';

export const curveKinds = ['arc', 'elliptical-arc', 'polyline', 'quadratic', 'cubic'] as const;

export type CurveKind = (typeof curveKinds)[number];

export type CurveLike = ArcShape | EllipticalArcShape | PolylineShape | QuadraticShape | CubicShape;

export function isCurveKind(value: string): value is CurveKind {
  return curveKinds.includes(value as CurveKind);
}

export function assertIsCurveKind(value: string): CurveKind {
  if (!isCurveKind(value)) {
    throw Error(`Value ${value} is not curve kind.`);
  }

  return value;
}

export function isCurveLike(value: Shape): value is CurveLike {
  return isCurveKind(value.kind);
}

export function assertIsCurveLike(value: object): CurveLike {
  const shape = assertIsShape(value);

  if (isCurveLike(shape)) {
    return shape;
  }

  switch (shape.kind) {
    case 'circle': {
      return assertIsArcShape(shape);
    }

    case 'ellipse': {
      return assertIsEllipticalArcShape(shape);
    }

    case 'clear-rect':
    case 'rectangle': {
      return assertIsPolyline(shape);
    }
  }

  throw new Error(`Value of kind ${shape.kind} is not a shape that can be cast to curve.`);
}

export function getPointAt(shape: CurveLike, t: number): XY {
  switch (shape.kind) {
    case 'arc': {
      const { x, y, startAngle, endAngle, radius } = shape;
      const angle = startAngle + (endAngle - startAngle) * t;
      const localResult = {
        x: x + radius * Math.cos(angle),
        y: y + radius * Math.sin(angle),
      };
      return applyMatrix(localResult, shape.t ?? identity());
    }

    case 'elliptical-arc': {
      const { x, y, startAngle, endAngle, radiusX, radiusY, rotation } = shape;
      const angle = startAngle + (endAngle - startAngle) * t;

      // Parametric ellipse before rotation
      const xPrime = radiusX * Math.cos(angle);
      const yPrime = radiusY * Math.sin(angle);

      // Apply rotation
      const xRot = xPrime * Math.cos(rotation) - yPrime * Math.sin(rotation);
      const yRot = xPrime * Math.sin(rotation) + yPrime * Math.cos(rotation);

      const localResult = { x: x + xRot, y: y + yRot };
      return applyMatrix(localResult, shape.t ?? identity());
    }

    case 'polyline': {
      const { start, end, points } = shape;
      const vertices = [start, ...points, end];

      // Compute segment lengths
      const segLengths: number[] = [];
      let total = 0;
      for (let i = 0; i < vertices.length - 1; i++) {
        const next = vertices[i + 1];
        const current = vertices[i];
        const len = distance(next, current);
        segLengths.push(len);
        total += len;
      }

      // Walk along segments
      let dist = t * total;
      for (let i = 0; i < segLengths.length; i++) {
        if (dist <= segLengths[i]) {
          const p0 = vertices[i];
          const p1 = vertices[i + 1];
          const localT = segLengths[i] === 0 ? 0 : dist / segLengths[i];
          const localResult = {
            x: p0.x + (p1.x - p0.x) * localT,
            y: p0.y + (p1.y - p0.y) * localT,
          };
          return applyMatrix(localResult, shape.t ?? identity());
        }
        dist -= segLengths[i];
      }

      // Fallback: return last vertex
      return applyMatrix(vertices[vertices.length - 1], shape.t ?? identity());
    }

    case 'quadratic': {
      const { start, control, end } = shape;
      const u = 1 - t;
      const localResult = {
        x: u * u * start.x + 2 * u * t * control.x + t * t * end.x,
        y: u * u * start.y + 2 * u * t * control.y + t * t * end.y,
      };
      return applyMatrix(localResult, shape.t ?? identity());
    }

    case 'cubic': {
      const { start, control1, control2, end } = shape;
      const u = 1 - t;
      const localResult = {
        x:
          u * u * u * start.x +
          3 * u * u * t * control1.x +
          3 * u * t * t * control2.x +
          t * t * t * end.x,
        y:
          u * u * u * start.y +
          3 * u * u * t * control1.y +
          3 * u * t * t * control2.y +
          t * t * t * end.y,
      };
      return applyMatrix(localResult, shape.t ?? identity());
    }
  }
}
