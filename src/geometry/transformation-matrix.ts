import { type XY } from './xy';

export type TransformationMatrix = {
  a: number;
  b: number; // scale + shear X
  c: number;
  d: number; // scale + shear Y
  e: number;
  f: number; // translation
};

export function isTransformationMatrix(
  value: unknown
): value is TransformationMatrix {
  return (
    typeof value === 'object' &&
    value !== null &&
    'a' in value &&
    typeof value.a === 'number' &&
    'b' in value &&
    typeof value.b === 'number' &&
    'c' in value &&
    typeof value.c === 'number' &&
    'd' in value &&
    typeof value.d === 'number' &&
    'e' in value &&
    typeof value.e === 'number' &&
    'f' in value &&
    typeof value.f === 'number'
  );
}

export function assertIsTransformationMatrix(
  value: unknown
): TransformationMatrix {
  if (!isTransformationMatrix(value)) {
    throw new Error('Provided value is not a transformation matrix.');
  }

  return value;
}

export function identity() {
  return {
    a: 1,
    b: 0,
    c: 0,
    d: 1,
    e: 0,
    f: 0,
  };
}

export function invert(m: TransformationMatrix): TransformationMatrix {
  const { a, b, c, d, e, f } = m;

  // Determinant of the 2×2 top‐left submatrix
  const det = a * d - b * c;
  if (det === 0) {
    throw new Error('Cannot invert matrix: determinant is zero');
  }
  const invDet = 1 / det;

  return {
    // inverse of [ [a c], [b d] ] scaled by invDet
    a: d * invDet,
    b: -b * invDet,
    c: -c * invDet,
    d: a * invDet,

    // translation components
    // e' = (c * f - d * e) / det
    // f' = (b * e - a * f) / det
    e: (c * f - d * e) * invDet,
    f: (b * e - a * f) * invDet,
  };
}

export function createTranslation(delta: XY): TransformationMatrix {
  const matrix: TransformationMatrix = {
    a: 1,
    b: 0,
    c: 0,
    d: 1,
    e: delta.x,
    f: delta.y,
  };
  return matrix;
}

export function createRotation(
  origin: XY,
  angle: number
): TransformationMatrix {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    a: cos,
    b: -sin,
    c: sin,
    d: cos,
    e: origin.x - origin.x * cos - origin.y * sin,
    f: origin.y + origin.x * sin - origin.y * cos,
  };
}

export function createScale(origin: XY, factor: XY): TransformationMatrix {
  return {
    a: factor.x,
    b: 0,
    c: 0,
    d: factor.y,
    e: origin.x * (1 - factor.x),
    f: origin.y * (1 - factor.y),
  };
}

export function createSkew(origin: XY, skew: XY): TransformationMatrix {
  const skewX = Math.tan(skew.x);
  const skewY = Math.tan(skew.y);

  return {
    a: 1,
    b: skewY,
    c: skewX,
    d: 1,
    e: -origin.y * skewX,
    f: -origin.x * skewY,
  };
}

export function compose(
  a: TransformationMatrix,
  b: TransformationMatrix
): TransformationMatrix {
  return {
    a: a.a * b.a + a.c * b.b,
    b: a.b * b.a + a.d * b.b,
    c: a.a * b.c + a.c * b.d,
    d: a.b * b.c + a.d * b.d,
    e: a.a * b.e + a.c * b.f + a.e,
    f: a.b * b.e + a.d * b.f + a.f,
  };
}
