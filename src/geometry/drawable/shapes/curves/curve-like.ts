import type { ArcShape } from '../arc-shape'
import type { EllipticalArcShape } from '../elliptical-arc-shape'
import type { CubicShape } from './cubic-shape'
import type { PolylineShape } from './polyline-shape'
import type { QuadraticShape } from './quadratic-shape'
import type { JsonObject } from '@/graph/core/models/json-value'
import { isArc } from '@/geometry/primitives/arc'
import { circleAsArc, isCircle } from '@/geometry/primitives/circle'
import { isCubic } from '@/geometry/primitives/cubic'
import { ellipseAsEllipticalArc, isEllipse } from '@/geometry/primitives/ellipse'
import { isEllipticalArc } from '@/geometry/primitives/elliptical-arc'
import { isPolyline } from '@/geometry/primitives/polyline'
import { isQuadratic } from '@/geometry/primitives/quadratic'
import { isRectangle, rectangleAsPolyline } from '@/geometry/primitives/rectangle'

export const curveKinds = ['arc', 'elliptical-arc', 'polyline', 'quadratic', 'cubic'] as const

export type CurveKind = (typeof curveKinds)[number]

export function isCurveKind(str: string): str is CurveKind {
  return curveKinds.includes(str as CurveKind)
}

export type CurveLike = ArcShape | EllipticalArcShape | PolylineShape | QuadraticShape | CubicShape

export function isCurveLike(value: JsonObject): value is CurveLike {
  if (!('kind' in value))
    return false
  if (!(typeof value.kind === 'string'))
    return false
  if (!isCurveKind(value.kind))
    return false

  switch (value.kind) {
    case 'arc':
      return isArc(value)
    case 'elliptical-arc':
      return isEllipticalArc(value)
    case 'polyline':
      return isPolyline(value)
    case 'quadratic':
      return isQuadratic(value)
    case 'cubic':
      return isCubic(value)
  }
}

export function asCurveLike(value: JsonObject): CurveLike {
  if (isArc(value)) {
    return {
      ...value,
      kind: 'arc',
    }
  }

  if (isEllipticalArc(value)) {
    return {
      ...value,
      kind: 'elliptical-arc',
    }
  }

  if (isPolyline(value)) {
    return {
      ...value,
      kind: 'polyline',
    }
  }

  if (isQuadratic(value)) {
    return {
      ...value,
      kind: 'quadratic',
    }
  }

  if (isCubic(value)) {
    return {
      ...value,
      kind: 'cubic',
    }
  }

  if (isCircle(value)) {
    return {
      ...circleAsArc(value),
      kind: 'arc',
    }
  }

  if (isEllipse(value)) {
    return {
      ...ellipseAsEllipticalArc(value),
      kind: 'elliptical-arc',
    }
  }

  if (isRectangle(value)) {
    return {
      ...rectangleAsPolyline(value),
      kind: 'polyline',
    }
  }

  throw new Error('Value is not a shape that can be cast to curve.')
}
