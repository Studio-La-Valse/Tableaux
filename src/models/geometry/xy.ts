import type { TransformationMatrix } from './transformation-matrix'

export type XY = { x: number; y: number }

export function isXY(value: unknown): value is XY {
  return (
    typeof value === 'object' &&
    value !== null &&
    'x' in value &&
    'y' in value &&
    typeof value.x === 'number' &&
    typeof value.y === 'number'
  )
}

export function applyMatrix(p: XY, m: TransformationMatrix): XY {
  return {
    x: p.x * m.a + p.y * m.c + m.e,
    y: p.x * m.b + p.y * m.d + m.f,
  }
}

export function distance(left: XY, right: XY): number {
  return Math.hypot(right.x - left.x, right.y - left.y)
}

export function distanceSquared(left: XY, right: XY): number {
  const dx = right.x - left.x
  const dy = right.y - left.y
  return dx * dx + dy * dy
}
