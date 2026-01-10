import type { Drawable } from './drawable'
import type { JsonObject } from '@/graph/core/models/json-value'
import { textOps } from '@/geometry/text/text-ops'
import { arcOps } from '../../arc-ops'
import { circleOps } from '../../circle-ops'
import { cubicOps } from '../../cubic-ops'
import { ellipseOps } from '../../ellipse-ops'
import { ellipticalArcOps } from '../../elliptical-arc-ops'
import { lineOps } from '../../line-ops'
import { polylineOps } from '../../polyline-ops'
import { quadraticOps } from '../../quadratic-ops'
import { rectangleOps } from '../../rectangle-ops'

// ----------------- Types ----------------------

export type DrawableOps<S extends Drawable> = {
  match: (value: JsonObject) => value is S
  cast: (value: JsonObject) => S
  draw: (ctx: CanvasRenderingContext2D, value: S) => void
}

// ----------------- Registry -----------------

export const drawableRegistry = [
  arcOps,
  circleOps,
  cubicOps,
  ellipseOps,
  ellipticalArcOps,
  lineOps,
  polylineOps,
  quadraticOps,
  rectangleOps,
  textOps,
] as const

// ----------------- Dispatcher -----------------

export function getOpsFor<S extends Drawable>(shape: JsonObject): DrawableOps<S> {
  for (const entry of drawableRegistry) {
    if (entry.match(shape)) {
      return entry as any as DrawableOps<S>
    }
  }

  throw new Error('No drawable ops registered for this shape')
}

export const drawableOps: DrawableOps<Drawable> = {
  match(value: JsonObject): value is Drawable {
    return getOpsFor(value).match(value)
  },
  cast(value: JsonObject): Drawable {
    return getOpsFor(value).cast(value)
  },
  draw(ctx: CanvasRenderingContext2D, element: Drawable): void {
    getOpsFor(element).draw(ctx, element)
  },
}
