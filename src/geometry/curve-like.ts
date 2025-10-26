import type { JsonObject } from '@/graph/core/models/json-value';
import { isArc, type ArcShape } from './arc';
import { isCubic, type CubicShape } from './cubic';
import { isEllipticalArc, type EllipticalArcShape } from './elliptical-arc';
import { isPolyline, type PolylineShape } from './polyline';
import { isQuadratic, type QuadraticShape } from './quadratic';
import { isRectangle, rectangleAsPolyline } from './rectangle';
import { identity } from './transformation-matrix';
import { applyMatrix, distance, type XY } from './xy';
import { circleAsArc, isCircle } from './circle';
import { ellipseAsEllipticalArc, isEllipse } from './ellipse';

export const curveKinds = ['arc', 'elliptical-arc', 'polyline', 'quadratic', 'cubic'] as const;

export type CurveKind = (typeof curveKinds)[number];

export function isCurveKind(str: string): str is CurveKind {
  return str in curveKinds;
}

export type CurveLike = ArcShape | EllipticalArcShape | PolylineShape | QuadraticShape | CubicShape;

export function isCurveLike(value: JsonObject): value is CurveLike {
  if (!('kind' in value)) return false;
  if (!(typeof value.kind === 'string')) return false;
  if (!isCurveKind(value.kind)) return false;

  switch (value.kind) {
    case 'arc':
      return isArc(value);
    case 'elliptical-arc':
      return isEllipticalArc(value);
    case 'polyline':
      return isPolyline(value);
    case 'quadratic':
      return isQuadratic(value);
    case 'cubic':
      return isCubic(value);
  }
}

export function asCurveLike(value: JsonObject): CurveLike {
  if (isArc(value)) {
    return {
      ...value,
      kind: 'arc',
    };
  }

  if (isEllipticalArc(value)) {
    return {
      ...value,
      kind: 'elliptical-arc',
    };
  }

  if (isPolyline(value)) {
    return {
      ...value,
      kind: 'polyline',
    };
  }

  if (isQuadratic(value)) {
    return {
      ...value,
      kind: 'quadratic',
    };
  }

  if (isCubic(value)) {
    return {
      ...value,
      kind: 'cubic',
    };
  }

  if (isCircle(value)) {
    return {
      ...circleAsArc(value),
      kind: 'arc',
    };
  }

  if (isEllipse(value)) {
    return {
      ...ellipseAsEllipticalArc(value),
      kind: 'elliptical-arc',
    };
  }

  if (isRectangle(value)) {
    return {
      ...rectangleAsPolyline(value),
      kind: 'polyline',
    };
  }

  throw new Error(`Value is not a shape that can be cast to curve.`);
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
