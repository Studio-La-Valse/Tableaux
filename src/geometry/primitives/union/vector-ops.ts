// ----------------- Core type -----------------

import type { XY } from '../xy'
import type { Vector } from './vector'
import type { TransformationMatrix } from '@/geometry/transform/transformation-matrix'

export type VectorOps<S extends Vector> = {
  match: (value: unknown) => value is S

  cast: (value: unknown) => XY

  applyMatrix: (p: XY, m: TransformationMatrix) => XY

  normalize: (xy: XY) => XY

  multiply: (xy: XY, factor: number) => XY

  subtract: (end: XY, start: XY) => XY

  distance: (left: XY, right: XY) => number

  distanceSquared: (left: XY, right: XY) => number

  interpolate: (a: XY, b: XY, t: number) => XY
}
