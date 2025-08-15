import { isOfShapeKind, type Shape } from '@/geometry/shape'
import type { Arc } from '../geometry/arc'
import { IDENTITY_ORIGIN, IDENTITY_RADIUS, type Circle } from '../geometry/circle'
import { formatCSSRGBA } from '../geometry/color-rgb'
import type { Ellipse } from '../geometry/ellipse'
import type { EllipticalArc } from '../geometry/elliptical-arc'
import { hasFill } from '../geometry/fill'
import { IDENTITY_END, IDENTITY_START, type Line } from '../geometry/line'
import { type Parallelogram } from '../geometry/parallelogram'
import { deconstruct as deconstructRectangle, type Rectangle } from '../geometry/rectangle'
import { IDENTITY_BR, IDENTITY_TL, type Square } from '../geometry/square'
import { hasStroke } from '../geometry/stroke'
import type { TextShape } from '@/geometry/text-shape'
import { hasAlignment, hasBaseLine, hasDirection } from '@/geometry/text-format-options'
import { hasRoundCorners, type RoundCorners } from '@/geometry/round-corners'
import { decomposeMatrix } from '@/geometry/decomposed-transformation-matrix'
import { formatCtx } from '@/geometry/font'

export class BitmapPainter {
  constructor(private ctx: CanvasRenderingContext2D) {}

  public Init(width: number, height: number): BitmapPainter {
    this.ctx.imageSmoothingEnabled = false

    this.resetTransform()

    this.ctx.clearRect(0, 0, width, height)
    this.ctx.save()

    return this
  }

  public DrawElements(elements: Iterable<Shape | TextShape>): BitmapPainter {
    for (const element of elements) {
      this.DrawElement(element)
    }

    return this
  }

  public DrawElement(element: Shape | TextShape): BitmapPainter {
    switch (element.kind) {
      case 'arc':
      case 'elliptical-arc':
      case 'circle':
      case 'ellipse':
        return this.DrawCircle(element)
      case 'line':
        return this.DrawLine(element)
      case 'rectangle':
      case 'square':
      case 'parallelogram':
        return this.DrawRectangle(element)
      case 'text':
        return this.drawText(element)
    }
  }

  public DrawLine(element: Line): this {
    const { a, b, c, d, e, f } = element.transformation

    this.ctx.save()

    this.ctx.setTransform(a, b, c, d, e, f)

    this.ctx.beginPath()
    this.ctx.moveTo(IDENTITY_START.x, IDENTITY_START.y)
    this.ctx.lineTo(IDENTITY_END.x, IDENTITY_END.y)

    this.setStroke(element)

    this.ctx.restore()

    return this
  }

  public DrawRectangle(element: Square | Rectangle | Parallelogram): this {
    if (hasRoundCorners(element)) {
      if (isOfShapeKind(element, ['parallelogram']))
        throw new Error('Cannot draw a parallogram with round corners.')
      return this.DrawRectangleRoundCorners(element)
    }

    const { a, b, c, d, e, f } = element.transformation

    this.ctx.save()
    this.ctx.setTransform(a, b, c, d, e, f)
    this.ctx.beginPath()
    this.ctx.rect(
      IDENTITY_TL.x,
      IDENTITY_TL.y,
      IDENTITY_BR.x - IDENTITY_TL.x,
      IDENTITY_BR.y - IDENTITY_TL.y,
    )

    this.setFill(element)
    this.setStroke(element)

    this.ctx.restore()

    return this
  }

  public DrawRectangleRoundCorners(element: (Square | Rectangle) & RoundCorners): this {
    const { translation, rotation } = decomposeMatrix(element.transformation)

    this.ctx.save()

    this.ctx.translate(translation.x, translation.y)
    this.ctx.rotate(rotation)

    const { width, height } = deconstructRectangle(element)
    this.ctx.beginPath()
    this.ctx.roundRect(0, 0, width, height, [
      element.topLeft ?? 0,
      element.topRight ?? 0,
      element.bottomRight ?? 0,
      element.bottomLeft ?? 0,
    ])

    this.setFill(element)
    this.setStroke(element)

    this.ctx.restore()

    return this
  }

  public DrawCircle(element: Arc | EllipticalArc | Circle | Ellipse): this {
    const { a, b, c, d, e, f } = element.transformation
    let start = 0
    let end = Math.PI * 2
    let counterClockwise = true
    switch (element.kind) {
      case 'arc':
      case 'elliptical-arc':
        start = element.startAngle
        end = element.endAngle
        counterClockwise = !(element.clockwise ?? false)
    }
    this.ctx.save()
    this.ctx.setTransform(a, b, c, d, e, f)
    this.ctx.beginPath()
    this.ctx.arc(
      IDENTITY_ORIGIN.x,
      IDENTITY_ORIGIN.y,
      IDENTITY_RADIUS,
      start,
      end,
      counterClockwise,
    )

    this.setFill(element)
    this.setStroke(element)

    this.ctx.restore()

    return this
  }

  public drawText(element: TextShape) {
    const fill = hasFill(element)
    const stroke = hasStroke(element)
    if (!fill && !stroke) return this

    const { a, b, c, d, e, f } = element.transformation

    this.ctx.save()
    const fontName = formatCtx(element.fontFamily, element.fontSize)
    this.ctx.font = fontName

    if (hasAlignment(element)) {
      this.ctx.textAlign = element.align
    }

    if (hasBaseLine(element)) {
      this.ctx.textBaseline = element.baseline
    }

    if (hasDirection(element)) {
      this.ctx.direction = element.direction
    }

    this.ctx.setTransform(a, b, c, d, e, f)

    if (fill) {
      this.ctx.fillStyle = formatCSSRGBA(element.fill)
      this.ctx.fillText(element.text, 0, 0)
    }
    if (stroke) {
      this.ctx.strokeStyle = formatCSSRGBA(element.stroke)
      this.ctx.lineWidth = element.strokeWidth
      this.ctx.strokeText(element.text, 0, 0)
    }

    this.ctx.restore()

    return this
  }

  public setFill(element: object) {
    if (!hasFill(element)) return

    this.ctx.fillStyle = formatCSSRGBA(element.fill)
    this.ctx.fill()
  }

  public setStroke(element: object) {
    if (!hasStroke(element)) return

    this.ctx.strokeStyle = formatCSSRGBA(element.stroke)
    this.ctx.lineWidth = element.strokeWidth
    this.ctx.stroke()
  }

  public resetTransform() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0)
  }

  public Finish(): BitmapPainter {
    this.ctx.restore()
    return this
  }
}
