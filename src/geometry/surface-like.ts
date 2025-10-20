import type { CircleShape } from './circle';
import type { ClearRectShape } from './clear-rect';
import type { EllipseShape } from './ellipse';
import { type RectangleShape } from './rectangle';
import { assertIsShape, type Shape } from './shape';
import { identity, invert } from './transformation-matrix';
import { applyMatrix, type XY } from './xy';

export const surfaceKinds = ['circle', 'ellipse', 'rectangle', 'clear-rect'] as const;

export type SurfaceKind = (typeof surfaceKinds)[number];

export type SurfaceLike = CircleShape | EllipseShape | RectangleShape | ClearRectShape;

export function isSurfaceKind(value: string): value is SurfaceKind {
  return surfaceKinds.includes(value as SurfaceKind);
}

export function isSurfaceLike(value: Shape): value is SurfaceLike {
  return isSurfaceKind(value.kind);
}

export function assertIsSurfaceLike(value: object): SurfaceLike {
  const shape = assertIsShape(value);

  if (isSurfaceLike(shape)) {
    return shape;
  }

  throw Error(`Shape of kind ${shape.kind} is not surface like.`)
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

    case 'clear-rect':
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

    case 'clear-rect':
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

    case 'clear-rect':
    case 'rectangle': {
      const { x, y, width, height } = surface;
      local = { x: x + width / 2, y: y + height / 2 };
      break;
    }
  }

  // Apply optional transform
  return applyMatrix(local, surface.t ?? identity());
}
