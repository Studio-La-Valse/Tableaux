import type { Ellipse } from './ellipse'
import type { BaseShape } from './shape'
import type { TransformationMatrix } from './transformation-matrix'
import type { XY } from './xy'
import type { JsonObject } from '@/graph/core/models/json-value'
import { arcAsEllipticalArc, isArc } from './arc'
import { circleAsEllipticalArc, isCircle } from './circle'
import { ellipseAsEllipticalArc, isEllipse } from './ellipse'

export type EllipticalArc = Ellipse & {
  startAngle: number
  endAngle: number
  counterclockwise: boolean
}

export function isEllipticalArc(object: object): object is EllipticalArc {
  return (
    isEllipse(object)
    && 'startAngle' in object
    && typeof object.startAngle === 'number'
    && 'endAngle' in object
    && typeof object.endAngle === 'number'
    && 'counterclockwise' in object
    && typeof object.counterclockwise === 'boolean'
  )
}

export type EllipticalArcShape = BaseShape & {
  kind: 'elliptical-arc'
} & EllipticalArc

export function createEllipticalArc(
  origin: XY,
  radiusX: number,
  radiusY: number,
  rotation: number,
  startAngle: number,
  endAngle: number,
  counterclockwise: boolean = false,
  transformationMatrix?: TransformationMatrix,
): EllipticalArcShape {
  return {
    kind: 'elliptical-arc',
    ...origin,
    radiusX,
    radiusY,
    rotation,
    startAngle,
    endAngle,
    counterclockwise,
    t: transformationMatrix,
  }
}

export function asEllipticalArc(object: JsonObject): EllipticalArc {
  if (isEllipticalArc(object)) {
    return {
      ...object,
    }
  }

  if (isEllipse(object)) {
    return ellipseAsEllipticalArc(object)
  }

  if (isCircle(object)) {
    return circleAsEllipticalArc(object)
  }

  if (isArc(object)) {
    return arcAsEllipticalArc(object)
  }

  throw new Error('Object could not be cast to an elliptical arc.')
}
