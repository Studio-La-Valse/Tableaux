import { identity, type TransformationMatrix } from './transformation-matrix'
import { applyMatrix, type XY } from './xy'
import { getScale } from './decomposed-transformation-matrix'
import type { BaseShape } from './geometry'

/**
 * A Circle is just a transformed unit‐circle.
 */
export type Circle = BaseShape & { kind: 'circle' }

export const IDENTITY_ORIGIN: XY = { x: 0, y: 0 }
export const IDENTITY_RADIUS = 1

export function createCircleFromOriginAndRadius(origin: XY, radius: number): Circle {
  const transformation: TransformationMatrix = {
    a: radius, // scale X
    b: 0,
    c: 0,
    d: radius, // scale Y
    e: origin.x, // translate X
    f: origin.y, // translate Y
  }

  return createCircle(transformation)
}

/**
 * Create a new unit‐circle (center = 0,0, radius = 1) with optional initial transform.
 */
export function createCircle(transformation: TransformationMatrix = identity()): Circle {
  return { kind: 'circle', transformation }
}

/**
 * World‐space center = transform × (0,0).
 */
export function getCenter(circle: Circle): XY {
  return applyMatrix(IDENTITY_ORIGIN, circle.transformation)
}

/**
 * World‐space radius = unit‐radius × max scale.
 * (If non‐uniform, we pick the larger axis.)
 */
export function getRadius(circle: Circle): number {
  const { x: scaleX, y: scaleY } = getScale(circle.transformation)
  return IDENTITY_RADIUS * Math.max(scaleX, scaleY)
}
