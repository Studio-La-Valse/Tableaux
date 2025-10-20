import { curveKinds, type CurveLike } from './curve-like';
import { surfaceKinds, type SurfaceLike } from './surface-like';
import type { Fill } from './fill';
import type { Filter } from './filter';
import type { Stroke } from './stroke';
import type { TextShape } from './text';
import type { TransformationMatrix } from './transformation-matrix';
import type { ClearRectShape } from './clear-rect';

export const shapeKinds = [...curveKinds, ...surfaceKinds, 'text', 'clear-rect'] as const;

export type ShapeKind = (typeof shapeKinds)[number];

export function isShapeKind(value: string): value is ShapeKind {
  return shapeKinds.includes(value as ShapeKind);
}

export function assertIsShapeKind(value: string): ShapeKind {
  if (!isShapeKind(value)) {
    throw Error('Value is not a shape kind');
  }

  return value;
}

export function isOfShapeKind<K extends Shape['kind']>(
  geom: Shape,
  allowedKinds: K[]
): geom is Extract<Shape, { kind: K }> {
  return allowedKinds.includes(geom.kind as K);
}

export function assertIsOfShapeKind<K extends Shape['kind']>(
  geom: Shape,
  allowedKinds: K[]
): Extract<Shape, { kind: K }> {
  if (!allowedKinds.includes(geom.kind as K)) {
    throw new Error(
      `Provided shape with kind ${geom.kind} is not of kind [${allowedKinds.join(', ')}]`
    );
  }

  return geom as Extract<Shape, { kind: K }>;
}

export type BaseShape = {
  kind: ShapeKind;
  t?: TransformationMatrix;
} & Filter &
  Partial<Stroke & Fill>;

export type Shape = SurfaceLike | CurveLike | TextShape | ClearRectShape;

export function isShape(value: unknown): value is Shape {
  return (
    typeof value === 'object' &&
    value !== null &&
    'kind' in value &&
    typeof value.kind === 'string' &&
    isShapeKind(value.kind)
  );
}

export function assertIsShape(value: unknown): Shape {
  if (!isShape(value)) {
    throw new Error('Value is not a shape.');
  }

  return value;
}
