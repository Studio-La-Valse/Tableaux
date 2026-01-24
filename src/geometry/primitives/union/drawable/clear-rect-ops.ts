import type { ClearRect } from './clear-rect'
import type { DrawableOps } from './drawable-ops'
import type { JsonObject } from '@/graph/core/models/json-value'
import { drawShape } from '@/bitmap-painters/bitmap-painter'
import { rectangleOps } from '../../rectangle-ops'

export type ClearRectOps = DrawableOps<ClearRect> & {

}

export const clearRectOps: ClearRectOps = {
  match(value: JsonObject): value is ClearRect {
    return rectangleOps.match(value)
      && 'kind' in value
      && typeof value.kind === 'string'
      && value.kind === 'clear-rect'
  },
  cast(value: JsonObject): ClearRect {
    const rect = rectangleOps.cast(value)
    return {
      ...rect,
      kind: 'clear-rect',
    }
  },
  draw(ctx: CanvasRenderingContext2D, element: ClearRect) {
    drawShape(ctx, element, () => {
      const { x, y, width, height } = element
      ctx.clearRect(x, y, width, height)
    })
  },
}
