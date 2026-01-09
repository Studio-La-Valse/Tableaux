import type { Rectangle } from '../rectangle'
import type { XY } from '../xy'
import type { Curve } from './curve'
import type { TransformationMatrix } from '@/geometry/transform/transformation-matrix'
import type { JsonObject } from '@/graph/core/models/json-value'
import { arcOps } from '../arc-ops'
import { circleOps } from '../circle-ops'
import { cubicOps } from '../cubic-ops'
import { ellipseOps } from '../ellipse-ops'
import { ellipticalArcOps } from '../elliptical-arc-ops'
import { lineOps } from '../line-ops'
import { polylineOps } from '../polyline-ops'
import { quadraticOps } from '../quadratic-ops'
import { rectangleOps } from '../rectangle-ops'

// ----------------- Core type -----------------

export type CurveOps<S extends Curve> = {
  match: (value: JsonObject) => value is S
  cast: (object: JsonObject) => S
  pointAt: (shape: S, t: number, m?: TransformationMatrix) => XY
  length: (shape: S, m?: TransformationMatrix) => number
  boundingBox: (shape: S, m?: TransformationMatrix) => Rectangle
}

// ----------------- Registry -----------------

export const curveRegistry = [
  arcOps,
  circleOps,
  cubicOps,
  ellipseOps,
  ellipticalArcOps,
  lineOps,
  polylineOps,
  quadraticOps,
  rectangleOps,
] as const

// ----------------- Dispatcher -----------------

export function getOpsFor<S extends Curve>(shape: JsonObject): CurveOps<S> {
  for (const entry of curveRegistry) {
    // `guard` expects JsonObject; if your Curve is also JsonObject, this is fine
    if (entry.match(shape)) {
      return entry as any as CurveOps<S>
    }
  }

  throw new Error('No curve ops registered for this shape')
}

export const curveOps: CurveOps<Curve> = {
  match(value: JsonObject): value is Curve {
    for (const entry of curveRegistry) {
      if (entry.match(value)) {
        return true
      }
    }

    return false
  },
  cast(object: JsonObject): Curve {
    return getOpsFor(object).cast(object)
  },
  pointAt(shape: Curve, t: number, m?: TransformationMatrix): XY {
    return getOpsFor(shape).pointAt(shape, t, m)
  },
  length(shape: Curve, m?: TransformationMatrix): number {
    return getOpsFor(shape).length(shape, m)
  },
  boundingBox(shape: Curve, m?: TransformationMatrix): Rectangle {
    return getOpsFor(shape).boundingBox(shape, m)
  },
}
