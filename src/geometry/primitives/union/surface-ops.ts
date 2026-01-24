import type { Rectangle } from '../rectangle'
import type { XY } from '../xy'
import type { Surface } from './surface'
import type { JsonObject } from '@/graph/core/models/json-value'
import { circleOps } from '../circle-ops'
import { ellipseOps } from '../ellipse-ops'
import { rectangleOps } from '../rectangle-ops'

// ----------------- Core type -----------------

export type SurfaceOps<S extends Surface> = {
  match: (value: JsonObject) => value is S
  cast: (object: JsonObject) => S
  circumference: (object: S) => number
  area: (object: S) => number
  center: (object: S) => XY
  boundingBox: (object: S) => Rectangle
}

// ----------------- Registry -----------------

export const surfaceRegistry = [
  circleOps,
  ellipseOps,
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
  match(value: JsonObject): value is Surface {
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
  circumference(object: Surface): number {
    return getOpsFor(object).circumference(object)
  },
  area(object: Surface): number {
    return getOpsFor(object).area(object)
  },
  boundingBox(shape: Surface): Rectangle {
    return getOpsFor(shape).boundingBox(shape)
  },
  center(object: Surface): XY {
    return getOpsFor(object).center(object)
  },
}
