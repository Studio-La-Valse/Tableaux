import type { CurveLike } from '../curves/curve-like'
import type { SurfaceLike } from '../surfaces/surface-like'
import type { JsonObject } from '@/graph/core/models/json-value'
import { asCurveLike, curveKinds, isCurveKind, isCurveLike } from '../curves/curve-like'
import { asSurfaceLike, isSurfaceKind, isSurfaceLike, surfaceKinds } from '../surfaces/surface-like'

export const geometryKinds = [...curveKinds, ...surfaceKinds] as const

export type GeometryKind = (typeof geometryKinds)[number]

export function isGeometryKind(str: string): str is GeometryKind {
  return geometryKinds.includes(str as GeometryKind)
}

export type GeometryLike = CurveLike | SurfaceLike

export function isGeometryLike(value: JsonObject): value is GeometryLike {
  if (!('kind' in value))
    return false
  if (typeof value.kind !== 'string')
    return false
  if (!isGeometryKind(value.kind))
    return false

  // Delegate to the correct subsystem
  if (isCurveKind(value.kind))
    return isCurveLike(value)

  if (isSurfaceKind(value.kind))
    return isSurfaceLike(value)

  return false
}

export function asGeometryLike(value: JsonObject): GeometryLike {
  // Try curve first
  if (isCurveLike(value))
    return asCurveLike(value)

  // Try surface
  if (isSurfaceLike(value))
    return asSurfaceLike(value)

  throw new Error('Value is not an object that can be cast to curve or surface.')
}
