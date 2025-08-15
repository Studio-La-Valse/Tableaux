import type { BaseShape } from './shape'
import {
  compose,
  createRotation,
  createScale,
  createSkew,
  createTranslation,
  isTransformationMatrix,
  type TransformationMatrix,
} from './transformation-matrix'
import type { XY } from './xy'

export type TextShape = BaseShape & {
  kind: 'text'
  text: string
  fontFamily: string
  fontStyle: string
  fontSize: number
}

export function isTextShape(value: unknown): value is TextShape {
  return (
    typeof value === 'object' &&
    value !== null &&
    'kind' in value &&
    typeof value.kind === 'string' &&
    value.kind === 'text' &&
    'transformation' in value &&
    isTransformationMatrix(value.transformation)
  )
}

export function assertIsTextShape(value: unknown): TextShape {
  if (!isTextShape(value)) {
    throw new Error('Value is not a text shape.')
  }

  return value
}

export const createText = (
  text: string,
  origin: XY,
  fontFamily: string,
  fontSize: number,
  fontStyle: string
): TextShape => {
  const transformation: TransformationMatrix = {
    a: 1, // scale X
    b: 0,
    c: 0,
    d: 1, // scale Y
    e: origin.x, // translate X
    f: origin.y, // translate Y
  }

  return { kind: 'text', transformation, text, fontFamily, fontStyle, fontSize }
}

export function translate(text: TextShape, delta: XY): TextShape {
  const transformationMatrix = createTranslation(delta)
  const transformation = compose(transformationMatrix, text.transformation)
  return {
    ...text,
    transformation,
  }
}

export function scale(text: TextShape, origin: XY, factor: XY): TextShape {
  const transformationMatrix = createScale(origin, factor)
  const transformation = compose(transformationMatrix, text.transformation)
  return {
    ...text,
    transformation,
  }
}

export function scaleUniform(text: TextShape, origin: XY, factor: number): TextShape {
  const transformationMatrix = createScale(origin, { x: factor, y: factor })
  const transformation = compose(transformationMatrix, text.transformation)
  return {
    ...text,
    transformation,
  }
}

export function rotate(text: TextShape, origin: XY, angle: number): TextShape {
  const transformationMatrix = createRotation(origin, angle)
  const transformation = compose(transformationMatrix, text.transformation)
  return {
    ...text,
    transformation,
  }
}

export function skew(text: TextShape, origin: XY, factor: XY): TextShape {
  const transformationMatrix = createSkew(origin, factor)
  const transformation = compose(transformationMatrix, text.transformation)
  return {
    ...text,
    transformation,
  }
}
