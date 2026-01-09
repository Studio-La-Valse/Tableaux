import type { DrawableOps } from '../primitives/union/drawable/drawable-ops'
import type { Text } from './text'
import type { JsonObject } from '@/graph/core/models/json-value'
import { setFilter, setTextFormat, setTransform } from '@/bitmap-painters/bitmap-painter'
import { formatCSSRGBA } from '../color/color-rgb'
import { isXY } from '../primitives/xy'
import { isFont } from './font'

export type TextOps = DrawableOps<Text> & { }

export const textOps: TextOps = {
  match(object: JsonObject): object is Text {
    return (
      isXY(object)
      && 'text' in object
      && typeof object.text === 'string'
      && 'fontFamily' in object
      && isFont(object.fontFamily)
      && 'fontSize' in object
      && typeof object.fontSize === 'number'
    )
  },
  cast(object: JsonObject): Text {
    if (this.match(object)) {
      return {
        ...object,
      }
    }

    throw new Error('Object could not be cast to text shape')
  },
  draw(ctx: CanvasRenderingContext2D, element: Text): void {
    ctx.save()
    setTransform(ctx, element)
    setFilter(ctx, element)
    setTextFormat(ctx, element)

    const { x, y, text, stroke, strokeWidth, fill } = element

    if (stroke && strokeWidth) {
      ctx.strokeStyle = formatCSSRGBA(stroke)
      ctx.lineWidth = strokeWidth
      ctx.strokeText(text, x, y)
    }
    if (fill) {
      ctx.fillStyle = formatCSSRGBA(fill)
      ctx.fillText(text, x, y)
    }

    ctx.restore()
  },
}
