import type { TransformationMatrix } from './transformation-matrix'

export type XY = { x: number; y: number }

export function applyMatrix(p: XY, m: TransformationMatrix): XY {
  return {
    x: p.x * m.a + p.y * m.c + m.e,
    y: p.x * m.b + p.y * m.d + m.f,
  }
}

export type DeconstructedXY = {
  x: number
  y: number
  magnitude: number
  angle: number
}
export function deconstruct(xy: XY) {
  const { x, y } = xy
  const magnitude = Math.sqrt(x * x + y * y)
  const angle = Math.atan2(y, x)
  return {
    ...xy,
    magnitude,
    angle,
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

export function polygonArea(points: XY[]): number {
  let sum = 0
  for (let i = 0; i < points.length; i++) {
    const next = points[(i + 1) % points.length]
    sum += points[i].x * next.y - next.x * points[i].y
  }
  return Math.abs(sum / 2)
}

export function polygonPerimeter(points: XY[]): number {
  return points.reduce((sum, pt, i) => sum + distance(pt, points[(i + 1) % points.length]), 0)
}
