import type { TransformationMatrix } from '../transform/transformation-matrix'
import type { VectorOps } from './union/vector-ops'
import type { XY } from './xy'

export type XYOps = VectorOps<XY> & { }

export const xyOps: XYOps = {
  match(value: unknown): value is XY {
    return (
      typeof value === 'object'
      && value !== null
      && 'x' in value
      && 'y' in value
      && typeof value.x === 'number'
      && typeof value.y === 'number'
    )
  },

  cast(value: unknown): XY {
    if (this.match(value)) {
      return { ...value }
    }

    throw new Error('Value is not XY')
  },

  applyMatrix(p: XY, m: TransformationMatrix): XY {
    return {
      x: p.x * m.a + p.y * m.c + m.e,
      y: p.x * m.b + p.y * m.d + m.f,
    }
  },

  normalize(xy: XY): XY {
    const { x: inX, y: inY } = xy
    const length = Math.sqrt(inX * inX + inY * inY)

    let x = 0
    let y = 0

    if (length > 0) {
      x = inX / length
      y = inY / length
    }

    return { x, y }
  },

  multiply(xy: XY, factor: number): XY {
    const { x: inX, y: inY } = xy
    const x = inX * factor
    const y = inY * factor
    return { x, y }
  },

  subtract(end: XY, start: XY): XY {
    const x = end.x - start.x
    const y = end.y - start.y
    return { x, y }
  },

  distance(left: XY, right: XY): number {
    return Math.hypot(right.x - left.x, right.y - left.y)
  },

  distanceSquared(left: XY, right: XY): number {
    const dx = right.x - left.x
    const dy = right.y - left.y
    return dx * dx + dy * dy
  },

  interpolate(a: XY, b: XY, t: number): XY {
    return {
      x: a.x + t * (b.x - a.x),
      y: a.y + t * (b.y - a.y),
    }
  },
}
