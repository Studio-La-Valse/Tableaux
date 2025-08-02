import type { Shape } from '@/geometry/shape'
import type { Arc } from '../geometry/arc'
import { IDENTITY_ORIGIN, IDENTITY_RADIUS, type Circle } from '../geometry/circle'
import { formatCSSRGBA } from '../geometry/color-rgb'
import type { Ellipse } from '../geometry/ellipse'
import type { EllipticalArc } from '../geometry/elliptical-arc'
import { hasFill } from '../geometry/fill'
import type { Geometry } from '../geometry/geometry'
import { IDENTITY_END, IDENTITY_START, type Line } from '../geometry/line'
import type { Parallelogram } from '../geometry/parallelogram'
import { type Rectangle } from '../geometry/rectangle'
import { IDENTITY_BR, IDENTITY_TL, type Square } from '../geometry/square'
import { hasStroke } from '../geometry/stroke'

export class BitmapPainter {
  constructor(private ctx: CanvasRenderingContext2D) {}

  public Init(width: number, height: number): BitmapPainter {
    this.ctx.save()

    this.ctx.imageSmoothingEnabled = false

    this.resetTransform()
    this.ctx.clearRect(0, 0, width, height)

    return this
  }

  public DrawElements(elements: Iterable<Shape>): BitmapPainter {
    for (const element of elements) {
      this.DrawElement(element)
    }

    return this
  }

  public DrawElement(element: Shape): BitmapPainter {
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
    }
  }

  public DrawLine(element: Line): this {
    const { a, b, c, d, e, f } = element.transformation

    this.ctx.save()
    this.ctx.setTransform(a, b, c, d, e, f)
    this.ctx.beginPath()
    this.ctx.moveTo(IDENTITY_START.x, IDENTITY_START.y)
    this.ctx.lineTo(IDENTITY_END.x, IDENTITY_END.y)
    this.ctx.restore()
    this.setStroke(element)

    return this
  }

  public DrawRectangle(element: Square | Rectangle | Parallelogram): this {
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
    this.ctx.restore()
    this.setFill(element)
    this.setStroke(element)

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
    this.ctx.restore()
    this.setFill(element)
    this.setStroke(element)

    return this
  }

  public setFill(element: Geometry) {
    if (!hasFill(element)) return

    this.ctx.fillStyle = formatCSSRGBA(element.fill)
    this.ctx.fill()
  }

  public setStroke(element: Geometry) {
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
