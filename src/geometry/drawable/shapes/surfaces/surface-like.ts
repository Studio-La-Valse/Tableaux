import type { ClearRectShape } from '../../shapes/clear-rect'
import type { CircleShape } from '../circle-shape'
import type { RectangleShape } from '../curves/rectangle-shape'
import type { EllipseShape } from '../ellipse-shape'
import type { JsonObject } from '@/graph/core/models/json-value'
import { isCircle } from '@/geometry/primitives/circle'
import { isEllipse } from '@/geometry/primitives/ellipse'
import { isRectangle } from '@/geometry/primitives/rectangle'

export const surfaceKinds = ['circle', 'ellipse', 'rectangle', 'clear-rect'] as const

export type SurfaceKind = (typeof surfaceKinds)[number]

export function isSurfaceKind(str: string): str is SurfaceKind {
  return surfaceKinds.includes(str as SurfaceKind)
}

export type SurfaceLike = CircleShape | EllipseShape | RectangleShape | ClearRectShape

export function asSurfaceLike(value: JsonObject): SurfaceLike {
  if (isCircle(value)) {
    return {
      ...value,
      kind: 'circle',
    }
  }

  if (isEllipse(value)) {
    return {
      ...value,
      kind: 'ellipse',
    }
  }

  if (isRectangle(value)) {
    let kind: 'rectangle' | 'clear-rect' = 'rectangle'
    if ('kind' in value && typeof value.kind === 'string' && value.kind === 'clear-rect') {
      kind = 'clear-rect'
    }
    return {
      ...value,
      kind,
    }
  }

  throw new Error('Shape is not surface like.')
}

export function isSurfaceLike(object: JsonObject): object is SurfaceLike {
  if (!('kind' in object))
    return false
  if (!(typeof object.kind === 'string'))
    return false
  if (!isSurfaceKind(object.kind))
    return false

  switch (object.kind) {
    case 'circle':
      return isCircle(object)
    case 'ellipse':
      return isEllipse(object)
    case 'clear-rect':
    case 'rectangle':
      return isRectangle(object)
  }
}
