import type { Drawable } from '@/geometry/primitives/union/drawable/drawable'
import type { Filter } from '@/geometry/primitives/union/drawable/filter'
import type { Text } from '@/geometry/text/text'
import { formatCtx } from '@/geometry/text/font'
import { identity } from '@/geometry/transform/transformation-matrix'
import { formatCSSRGBA } from '../geometry/color/color-rgb'

export function formatCtxFilter(filter: Filter): string {
  const parts: string[] = []

  if (filter.blur) {
    parts.push(`blur(${filter.blur.size}px)`)
  }

  if (filter.dropShadow) {
    const { offset, color, size } = filter.dropShadow
    const cssArgb = formatCSSRGBA(color)
    parts.push(`drop-shadow(${offset.x}px ${offset.y}px ${size}px ${cssArgb})`)
  }

  return parts.join(' ')
}

export function init(
  canvasRef: HTMLCanvasElement,
  width: number,
  height: number,
): CanvasRenderingContext2D {
  // Ensure the canvas matches the intended drawing surface
  canvasRef.width = width
  canvasRef.height = height

  const ctx = canvasRef.getContext('2d')
  if (!ctx) {
    throw new Error('A 2d context could not be created from an HTML Canvas Element.')
  }

  ctx.imageSmoothingEnabled = false
  const { a, b, c, d, e, f } = identity()
  ctx.setTransform(a, b, c, d, e, f)

  return ctx
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

  ctx.fillStyle = formatCSSRGBA(fill)
  ctx.fill()
}

function applyStroke(ctx: CanvasRenderingContext2D, element: Drawable) {
  const { stroke, strokeWidth } = element
  if (!stroke || !strokeWidth)
    return

  ctx.strokeStyle = formatCSSRGBA(stroke)
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
