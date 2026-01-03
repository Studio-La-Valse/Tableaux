import type { BaseShape } from '../shape'
import type { Polyline } from '@/geometry/primitives/polyline'
import type { XY } from '@/geometry/primitives/xy'
import type { TransformationMatrix } from '@/geometry/transform/transformation-matrix'

export type PolylineShape = BaseShape & { kind: 'polyline' } & Polyline

export function createPolyline(
  start: XY,
  end: XY,
  transformation?: TransformationMatrix,
  ...points: XY[]
): PolylineShape {
  const line: PolylineShape = {
    kind: 'polyline',
    start,
    points,
    end,
    t: transformation,
  }

  return line
}
