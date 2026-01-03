import type { GeometryLike } from './geometry-like'
import type { XY } from '@/geometry/primitives/xy'
import { samplePointsOnCurve } from '../curves/analysis'
import { isCurveLike } from '../curves/curve-like'
import { samplePointsOnSurface } from '../surfaces/analysis'
import { isSurfaceLike } from '../surfaces/surface-like'

export function sampleGeometry(
  geom: GeometryLike,
  count: number,
  seed: number,
): XY[] {
  if (isCurveLike(geom))
    return samplePointsOnCurve(geom, count, seed)

  if (isSurfaceLike(geom))
    return samplePointsOnSurface(geom, count, seed)

  throw new Error(`Unsupported geometry kind: ${(geom as any).kind}`)
}
