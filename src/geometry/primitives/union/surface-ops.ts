import type { Rectangle } from '../rectangle'
import type { Surface } from './surface'
import type { TransformationMatrix } from '@/geometry/transform/transformation-matrix'
import type { JsonObject } from '@/graph/core/models/json-value'
import { arcOps } from '../arc-ops'
import { circleOps } from '../circle-ops'
import { ellipseOps } from '../ellipse-ops'
import { ellipticalArcOps } from '../elliptical-arc-ops'
import { rectangleOps } from '../rectangle-ops'

// ----------------- Core type -----------------

export type SurfaceOps<S extends Surface> = {
  guard: (value: JsonObject) => value is S
  cast: (object: JsonObject) => S
  circumference: (object: S, m?: TransformationMatrix) => number
  area: (object: S, m?: TransformationMatrix) => number
  boundingBox: (object: S, m?: TransformationMatrix) => Rectangle
}

// ----------------- Registry -----------------

export const surfaceRegistry = [
  arcOps,
  circleOps,
  ellipseOps,
  ellipticalArcOps,
  rectangleOps,
] as const

// ----------------- Dispatcher -----------------

export function getOpsFor<S extends Surface>(shape: JsonObject): SurfaceOps<S> {
  for (const entry of surfaceRegistry) {
    // `guard` expects JsonObject; if your Surface is also JsonObject, this is fine
    if (entry.match(shape)) {
      return entry as any as SurfaceOps<S>
    }
  }

  throw new Error('No surface ops registered for this shape')
}

export const surfaceOps: SurfaceOps<Surface> = {
  guard(value: JsonObject): value is Surface {
    for (const entry of surfaceRegistry) {
      if (entry.match(value)) {
        return true
      }
    }

    return false
  },
  cast(object: JsonObject): Surface {
    return getOpsFor(object).cast(object)
  },
  circumference(object: Surface, m?: TransformationMatrix): number {
    return getOpsFor(object).circumference(object, m)
  },
  area(object: Surface, m?: TransformationMatrix): number {
    return getOpsFor(object).area(object, m)
  },
  boundingBox(shape: Surface, m?: TransformationMatrix): Rectangle {
    return getOpsFor(shape).boundingBox(shape, m)
  },
}
