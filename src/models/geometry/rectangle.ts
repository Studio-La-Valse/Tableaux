import { identity, type TransformationMatrix } from './transformation-matrix'
import { applyMatrix, type XY } from './xy'
import { getScale } from './decomposed-transformation-matrix'
import type { BaseShape } from './geometry'
/**
 * A Rectangle is just a transformed unit square.
 */
export type Rectangle = BaseShape & { kind: 'rectangle' }

export const IDENTITY_RECTANGLE_TL: XY = { x: 0, y: 0 }
export const IDENTITY_RECTANGLE_TR: XY = { x: 1, y: 0 }
export const IDENTITY_RECTANGLE_BR: XY = { x: 1, y: 1 }
export const IDENTITY_RECTANGLE_BL: XY = { x: 0, y: 1 }
export const IDENTITY_RECTANGLE_CENTER: XY = { x: 0.5, y: 0.5 }

export function createRectangleFromDimensions(
  topLeft: XY,
  width: number,
  height: number,
): Rectangle {
  const transformation: TransformationMatrix = {
    a: width, // scale X
    b: 0,
    c: 0,
    d: height, // scale Y
    e: topLeft.x, // translate X
    f: topLeft.y, // translate Y
  }

  return createRectangle(transformation)
}

/**
 * Create a new unit‐rectangle with an optional initial transform.
 */
export function createRectangle(transformation: TransformationMatrix = identity()): Rectangle {
  return { kind: 'rectangle', transformation }
}

/**
 * Transformed corners in world‐space.
 */
export function getTopLeft(rect: Rectangle): XY {
  return applyMatrix(IDENTITY_RECTANGLE_TL, rect.transformation)
}
export function getTopRight(rect: Rectangle): XY {
  return applyMatrix(IDENTITY_RECTANGLE_TR, rect.transformation)
}
export function getBottomRight(rect: Rectangle): XY {
  return applyMatrix(IDENTITY_RECTANGLE_BR, rect.transformation)
}
export function getBottomLeft(rect: Rectangle): XY {
  return applyMatrix(IDENTITY_RECTANGLE_BL, rect.transformation)
}

/**
 * World‐space center.
 */
export function getCenter(rect: Rectangle): XY {
  return applyMatrix(IDENTITY_RECTANGLE_CENTER, rect.transformation)
}

/**
 * Width and height derived from the decomposed scale.
 * Non-uniform transforms are respected.
 */
export function getWidth(rect: Rectangle): number {
  const { x: sx } = getScale(rect.transformation)
  return sx
}
export function getHeight(rect: Rectangle): number {
  const { y: sy } = getScale(rect.transformation)
  return sy
}
