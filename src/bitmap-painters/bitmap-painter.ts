import type { Drawable } from '@/geometry/primitives/union/drawable/drawable'
import type { Filter } from '@/geometry/primitives/union/drawable/filter'
import type { Text } from '@/geometry/text/text'
import { rgbOps } from '@/geometry/color/color-rgb-ops'
import { formatCtx } from '@/geometry/text/font'
import { identity } from '@/geometry/transform/transformation-matrix'

export function formatCtxFilter(filter: Filter): string {
  const parts: string[] = []

  if (filter.blur) {
    parts.push(`blur(${filter.blur.size}px)`)
  }

  if (filter.dropShadow) {
    const { offset, color, size } = filter.dropShadow
    const cssArgb = rgbOps.convert.css(color)
    parts.push(`drop-shadow(${offset.x}px ${offset.y}px ${size}px ${cssArgb})`)
  }

  return parts.join(' ')
}

export function clear(ctx: CanvasRenderingContext2D) {
  const width = ctx.canvas.width
  const height = ctx.canvas.height

  ctx.clearRect(0, 0, width, height)
}

// --- shared helpers ---

export function setTransform(ctx: CanvasRenderingContext2D, element: Drawable) {
  const { a, b, c, d, e, f } = element.t ?? identity()
  ctx.setTransform(a, b, c, d, e, f)
}

export function setFilter(ctx: CanvasRenderingContext2D, element: Drawable) {
  ctx.filter = formatCtxFilter(element)
}

export function setTextFormat(ctx: CanvasRenderingContext2D, element: Text) {
  const { fontFamily, fontSize, align, baseline, direction } = element

  ctx.font = formatCtx(fontFamily, fontSize)
  ctx.textAlign = align ?? 'left'
  ctx.textBaseline = baseline ?? 'alphabetic'
  ctx.direction = direction ?? 'inherit'
}

function applyFill(ctx: CanvasRenderingContext2D, element: Drawable) {
  const { fill } = element
  if (!fill)
    return

  ctx.fillStyle = rgbOps.convert.css(fill)
  ctx.fill()
}

function applyStroke(ctx: CanvasRenderingContext2D, element: Drawable) {
  const { stroke, strokeWidth } = element
  if (!stroke || !strokeWidth)
    return

  ctx.strokeStyle = rgbOps.convert.css(stroke)
  ctx.lineWidth = strokeWidth
  ctx.stroke()
}

export function drawShape<T extends Drawable>(
  ctx: CanvasRenderingContext2D,
  element: T,
  _drawShape: (ctx: CanvasRenderingContext2D, element: T) => void,
) {
  ctx.save()

  setTransform(ctx, element)
  setFilter(ctx, element)

  ctx.beginPath()
  _drawShape(ctx, element)

  applyFill(ctx, element)
  applyStroke(ctx, element)

  ctx.restore()
}
