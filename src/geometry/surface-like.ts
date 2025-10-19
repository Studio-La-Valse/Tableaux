import { createArc } from './arc';
import type { CircleShape } from './circle';
import type { CurveLike } from './curve-like';
import type { EllipseShape } from './ellipse';
import { createEllipticalArc } from './elliptical-arc';
import { createPolyline } from './polyline';
import type { RectangleShape } from './rectangle';
import type { Shape } from './shape';
import { identity, invert } from './transformation-matrix';
import { applyMatrix, type XY } from './xy';

export const surfaceKinds = ['circle', 'ellipse', 'rectangle'] as const;

export type SurfaceKind = (typeof surfaceKinds)[number];

export type SurfaceLike = CircleShape | EllipseShape | RectangleShape;

export function isSurfaceKind(value: string): value is SurfaceKind {
  return surfaceKinds.includes(value as SurfaceKind);
}

export function isSurfaceLike(value: Shape): value is SurfaceLike {
  return isSurfaceKind(value.kind);
}

export function assertIsSurfaceLike(value: Shape): SurfaceLike {
  if (!isSurfaceLike(value)) {
    throw new Error('Value is not surface-like.');
  }

  return value;
}

export function pointOnSurface(surface: SurfaceLike, point: XY, epsilon = 1e-6): boolean {
  // Transform point into local coordinates
  const localPoint = surface.t ? applyMatrix(point, invert(surface.t)) : point;

  switch (surface.kind) {
    case 'circle': {
      const { x, y, radius } = surface;
      const dx = localPoint.x - x;
      const dy = localPoint.y - y;
      const dist = Math.hypot(dx, dy);
      return Math.abs(dist - radius) <= epsilon;
    }

    case 'ellipse': {
      const { x, y, radiusX, radiusY, rotation } = surface;
      // Rotate point back by -rotation
      const cosR = Math.cos(-rotation);
      const sinR = Math.sin(-rotation);
      const dx = localPoint.x - x;
      const dy = localPoint.y - y;
      const xr = dx * cosR - dy * sinR;
      const yr = dx * sinR + dy * cosR;

      // Normalized ellipse equation
      const value = (xr * xr) / (radiusX * radiusX) + (yr * yr) / (radiusY * radiusY);
      return Math.abs(value - 1) <= epsilon;
    }

    case 'rectangle': {
      const { x, y, width, height } = surface;
      const px = localPoint.x;
      const py = localPoint.y;

      const onLeft = Math.abs(px - x) <= epsilon && py >= y - epsilon && py <= y + height + epsilon;
      if (onLeft) return true;
      const onRight =
        Math.abs(px - (x + width)) <= epsilon && py >= y - epsilon && py <= y + height + epsilon;
      if (onRight) return true;
      const onTop = Math.abs(py - y) <= epsilon && px >= x - epsilon && px <= x + width + epsilon;
      if (onTop) return true;
      const onBottom =
        Math.abs(py - (y + height)) <= epsilon && px >= x - epsilon && px <= x + width + epsilon;
      return onBottom;
    }
  }
}

export function pointInSurface(surface: SurfaceLike, point: XY): boolean {
  // Transform point into local coordinates
  const localPoint = surface.t ? applyMatrix(point, invert(surface.t)) : point;

  switch (surface.kind) {
    case 'circle': {
      const { x, y, radius } = surface;
      const dx = localPoint.x - x;
      const dy = localPoint.y - y;
      const distSq = dx * dx + dy * dy;
      return distSq <= radius * radius;
    }

    case 'ellipse': {
      const { x, y, radiusX, radiusY, rotation } = surface;
      // Rotate point back by -rotation
      const cosR = Math.cos(-rotation);
      const sinR = Math.sin(-rotation);
      const dx = localPoint.x - x;
      const dy = localPoint.y - y;
      const xr = dx * cosR - dy * sinR;
      const yr = dx * sinR + dy * cosR;

      const value = (xr * xr) / (radiusX * radiusX) + (yr * yr) / (radiusY * radiusY);
      return value <= 1;
    }

    case 'rectangle': {
      const { x, y, width, height } = surface;
      return (
        localPoint.x >= x &&
        localPoint.x <= x + width &&
        localPoint.y >= y &&
        localPoint.y <= y + height
      );
    }
  }
}

export function getSurfaceCenter(surface: SurfaceLike): XY {
  let local: XY;

  switch (surface.kind) {
    case 'circle': {
      const { x, y } = surface;
      local = { x, y };
      break;
    }

    case 'ellipse': {
      const { x, y } = surface;
      local = { x, y };
      break;
    }

    case 'rectangle': {
      const { x, y, width, height } = surface;
      local = { x: x + width / 2, y: y + height / 2 };
      break;
    }
  }

  // Apply optional transform
  return applyMatrix(local, surface.t ?? identity());
}

export function surfaceToCurve(surface: SurfaceLike): CurveLike {
  switch (surface.kind) {
    case 'circle': {
      const { x, y, radius, t } = surface;
      const arc = createArc({ x, y }, radius, 0, Math.PI * 2, undefined, t);
      return arc;
    }

    case 'ellipse': {
      const { x, y, radiusX, radiusY, rotation, t } = surface;
      const eArc = createEllipticalArc(
        { x, y },
        radiusX,
        radiusY,
        rotation,
        0,
        Math.PI * 2,
        undefined,
        t
      );
      return eArc;
    }

    case 'rectangle': {
      const { x, y, width, height, t } = surface;
      const poly = createPolyline(
        { x, y },
        { x, y },
        t,
        { x: x + width, y },
        { x: x + width, y: y + height },
        { x, y: y + height }
      );
      return poly;
    }
  }
}
