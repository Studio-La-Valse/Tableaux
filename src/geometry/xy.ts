import {
  createRotation,
  createScale,
  createSkew,
  createTranslation,
  type TransformationMatrix,
} from './transformation-matrix';

export type XY = { x: number; y: number };

export function isXY(value: unknown): value is XY {
  return (
    typeof value === 'object' &&
    value !== null &&
    'x' in value &&
    'y' in value &&
    typeof value.x === 'number' &&
    typeof value.y === 'number'
  );
}

export function assertIsXY(value: unknown): XY {
  if (!isXY(value)) {
    throw new Error('Value is not XY');
  }

  return value;
}

export function assertAreXY<T extends unknown[]>(
  ...values: T
): { [K in keyof T]: XY } {
  return values.map((value, index) => {
    if (!isXY(value)) {
      throw new Error(`Value at index ${index} is not XY`);
    }
    return value;
  }) as { [K in keyof T]: XY };
}

export function applyMatrix(p: XY, m: TransformationMatrix): XY {
  return {
    x: p.x * m.a + p.y * m.c + m.e,
    y: p.x * m.b + p.y * m.d + m.f,
  };
}

export function fromAngleAndLength(angle: number, length: number): XY {
  const x = length * Math.cos(angle);
  const y = length * Math.sin(angle);
  return { x, y };
}

export function normalize(xy: XY): XY {
  const { x: inX, y: inY } = xy;
  const length = Math.sqrt(inX * inX + inY * inY);

  let x = 0;
  let y = 0;

  if (length > 0) {
    x = inX / length;
    y = inY / length;
  }

  return { x, y };
}

export function multiply(xy: XY, factor: number): XY {
  const { x: inX, y: inY } = xy;
  const x = inX * factor;
  const y = inY * factor;
  return { x, y };
}

export type DeconstructedXY = {
  x: number;
  y: number;
  magnitude: number;
  angle: number;
};
export function deconstruct(xy: XY) {
  const { x, y } = xy;
  const magnitude = Math.sqrt(x * x + y * y);
  const angle = Math.atan2(y, x);
  return {
    ...xy,
    magnitude,
    angle,
  };
}

export function distance(left: XY, right: XY): number {
  return Math.hypot(right.x - left.x, right.y - left.y);
}

export function distanceSquared(left: XY, right: XY): number {
  const dx = right.x - left.x;
  const dy = right.y - left.y;
  return dx * dx + dy * dy;
}

export function interpolate(a: XY, b: XY, t: number): XY {
  return {
    x: a.x + t * (b.x - a.x),
    y: a.y + t * (b.y - a.y),
  };
}

export function pointOnTransformedCircle(
  matrix: TransformationMatrix,
  angle: number
): XY {
  const unitPoint: XY = {
    x: Math.cos(angle),
    y: Math.sin(angle),
  };
  return applyMatrix(unitPoint, matrix);
}

export function polygonArea(points: XY[]): number {
  let sum = 0;
  for (let i = 0; i < points.length; i++) {
    const next = points[(i + 1) % points.length];
    sum += points[i].x * next.y - next.x * points[i].y;
  }
  return Math.abs(sum / 2);
}

export function polygonPerimeter(points: XY[]): number {
  return points.reduce(
    (sum, pt, i) => sum + distance(pt, points[(i + 1) % points.length]),
    0
  );
}

export function translate(xy: XY, delta: XY): XY {
  const transformationMatrix = createTranslation(delta);
  return applyMatrix(xy, transformationMatrix);
}

export function scale(xy: XY, origin: XY, factor: XY): XY {
  const transformationMatrix = createScale(origin, factor);
  return applyMatrix(xy, transformationMatrix);
}

export function scaleUniform(xy: XY, origin: XY, factor: number): XY {
  const transformationMatrix = createScale(origin, { x: factor, y: factor });
  return applyMatrix(xy, transformationMatrix);
}

export function rotate(xy: XY, origin: XY, angle: number): XY {
  const transformationMatrix = createRotation(origin, angle);
  return applyMatrix(xy, transformationMatrix);
}

export function skew(xy: XY, origin: XY, factor: XY): XY {
  const transformationMatrix = createSkew(origin, factor);
  return applyMatrix(xy, transformationMatrix);
}
