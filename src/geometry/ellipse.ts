import {
  compose,
  createRotation,
  createScale,
  createSkew,
  createTranslation,
  identity,
  type TransformationMatrix,
} from './transformation-matrix';
import { applyMatrix, type XY } from './xy';
import type { BaseShape } from './shape';
import { IDENTITY_ORIGIN, IDENTITY_RADIUS, type Circle } from './circle';

export type Ellipse = BaseShape & { kind: 'ellipse' };

export function createEllipse(origin: XY, radius: XY): Ellipse {
  const transformation: TransformationMatrix = {
    a: radius.x, // scale X
    b: 0,
    c: 0,
    d: radius.y, // scale Y
    e: origin.x, // translate X
    f: origin.y, // translate Y
  };

  return { kind: 'ellipse', transformation };
}

export function createUnitEllipse(
  transformation: TransformationMatrix = identity()
): Ellipse {
  return { kind: 'ellipse', transformation };
}

export type DeconstructedEllipse = {
  origin: XY;
  radiusX: number;
  radiusY: number;
  rotation: number;
  area: number;
  circumference: number;
};

export function deconstruct(ellipse: Ellipse | Circle): DeconstructedEllipse {
  const { transformation } = ellipse;

  // Origin is the transformed (0,0)
  const origin = applyMatrix(IDENTITY_ORIGIN, transformation);

  // Transformed unit vectors
  const transformedX = applyMatrix(
    { x: IDENTITY_RADIUS, y: 0 },
    transformation
  );
  const transformedY = applyMatrix(
    { x: 0, y: IDENTITY_RADIUS },
    transformation
  );

  // Radii are lengths of transformed unit vectors
  const radiusX = Math.hypot(
    transformedX.x - origin.x,
    transformedX.y - origin.y
  );

  const radiusY = Math.hypot(
    transformedY.x - origin.x,
    transformedY.y - origin.y
  );

  // Rotation is angle of transformed X-axis
  const dx = transformedX.x - origin.x;
  const dy = transformedX.y - origin.y;
  const rotation = Math.atan2(dy, dx); // in radians

  // Area remains unchanged by rotation
  const area = Math.PI * radiusX * radiusY;

  // Circumference approximation (Ramanujan's formula)
  const h = Math.pow(radiusX - radiusY, 2) / Math.pow(radiusX + radiusY, 2);
  const circumference =
    Math.PI * (radiusX + radiusY) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));

  return {
    origin,
    radiusX,
    radiusY,
    rotation,
    area,
    circumference,
  };
}

export function translate(ellipse: Ellipse, delta: XY): Ellipse {
  const transformationMatrix = createTranslation(delta);
  const multiplied = compose(transformationMatrix, ellipse.transformation);
  return {
    ...ellipse,
    transformation: multiplied,
  };
}

export function scale(ellipse: Ellipse, origin: XY, factor: XY): Ellipse {
  const transformationMatrix = createScale(origin, factor);
  const multiplied = compose(transformationMatrix, ellipse.transformation);
  return {
    ...ellipse,
    transformation: multiplied,
  };
}

export function scaleUniform(
  ellipse: Ellipse,
  origin: XY,
  factor: number
): Ellipse {
  const transformationMatrix = createScale(origin, { x: factor, y: factor });
  const multiplied = compose(transformationMatrix, ellipse.transformation);
  return {
    ...ellipse,
    transformation: multiplied,
  };
}

export function rotate(ellipse: Ellipse, origin: XY, angle: number): Ellipse {
  const transformationMatrix = createRotation(origin, angle);
  const multiplied = compose(transformationMatrix, ellipse.transformation);
  return {
    ...ellipse,
    transformation: multiplied,
  };
}

export function skew(ellipse: Ellipse, origin: XY, factor: XY): Ellipse {
  const transformationMatrix = createSkew(origin, factor);
  const multiplied = compose(transformationMatrix, ellipse.transformation);
  return {
    ...ellipse,
    transformation: multiplied,
  };
}
