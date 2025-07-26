import { identity, type TransformationMatrix } from './transformation-matrix'
import { applyMatrix, distance, type XY } from './xy'
import type { BaseShape } from './geometry'

/**
 * A Line is just a transformed unit‐segment [ (0,0) → (1,0) ].
 */
export type Line = BaseShape & { kind: 'line' }

export const IDENTITY_LINE_START: XY = { x: 0, y: 0 }
export const IDENTITY_LINE_END: XY = { x: 1, y: 0 }

export function createLineFromPoints(start: XY, end: XY): Line {
  const dx = end.x - start.x
  const dy = end.y - start.y

  // Length of the new line
  const length = Math.sqrt(dx * dx + dy * dy)

  // Angle of rotation in radians
  const angle = Math.atan2(dy, dx)

  // Transformation matrix to rotate, scale, and translate the unit line
  const transformation: TransformationMatrix = {
    a: Math.cos(angle) * length,
    b: Math.sin(angle) * length,
    c: -Math.sin(angle) * length,
    d: Math.cos(angle) * length,
    e: start.x,
    f: start.y,
  }

  return createLine(transformation)
}

/**
 * Create a new unit‐line with an optional initial transform.
 */
export function createLine(transformation: TransformationMatrix = identity()): Line {
  return { kind: 'line', transformation }
}

/**
 * World‐space start point = transform × (0,0).
 */
export function getStart(line: Line): XY {
  return applyMatrix(IDENTITY_LINE_START, line.transformation)
}

/**
 * World‐space end point = transform × (1,0).
 */
export function getEnd(line: Line): XY {
  return applyMatrix(IDENTITY_LINE_END, line.transformation)
}

/**
 * Midpoint of the transformed segment.
 */
export function getCenter(line: Line): XY {
  const s = getStart(line)
  const e = getEnd(line)
  return {
    x: (s.x + e.x) / 2,
    y: (s.y + e.y) / 2,
  }
}

/**
 * Euclidean length of the transformed segment.
 */
export function getLength(line: Line): number {
  return distance(getStart(line), getEnd(line))
}
