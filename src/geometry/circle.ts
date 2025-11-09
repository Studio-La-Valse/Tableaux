import type { Arc } from './arc'
import type { EllipticalArc } from './elliptical-arc'
import type { BaseShape } from './shape'
import type { XY } from './xy'
import type { JsonObject } from '@/graph/core/models/json-value'
import { isXY } from './xy'

export type Circle = { x: number, y: number, radius: number }
export type CircleShape = BaseShape & { kind: 'circle' } & Circle

export function isCircle(object: JsonObject): object is Circle {
  return isXY(object) && 'radius' in object && typeof object.radius === 'number'
}

export function asCircle(object: JsonObject): Circle {
  if (isCircle(object)) {
    return {
      ...object,
    }
  }

  throw new Error('Object could not be cast to a circle')
}

export function circleAsArc(circle: Circle): Arc {
  return {
    ...circle,
    startAngle: 0,
    endAngle: Math.PI * 2,
    counterclockwise: false,
  }
}

export function circleAsEllipticalArc(circle: Circle): EllipticalArc {
  return {
    ...circle,
    radiusX: circle.radius,
    radiusY: circle.radius,
    rotation: 0,
    startAngle: 0,
    endAngle: Math.PI * 2,
    counterclockwise: false,
  }
}

export function createCircle(origin: XY, radius: number): CircleShape {
  const circle: CircleShape = {
    kind: 'circle',
    ...origin,
    radius,
  }
  return circle
}
