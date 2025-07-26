import { IDENTITY_ORIGIN, IDENTITY_RADIUS, type Circle } from '../geometry/circle'
import { formatCSSRGBA } from '../geometry/color-rgb'
import { hasFill } from '../geometry/fill'
import type { Geometry } from '../geometry/geometry'
import { IDENTITY_LINE_END, IDENTITY_LINE_START, type Line } from '../geometry/line'
import { IDENTITY_RECTANGLE_BR, IDENTITY_RECTANGLE_TL, type Rectangle } from '../geometry/rectangle'
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

  public DrawElements(elements: Iterable<Geometry>): BitmapPainter {
    for (const element of elements) {
      this.DrawElement(element)
    }

    return this
  }

  public DrawElement(element: Geometry): BitmapPainter {
    switch (element.kind) {
      case 'circle':
        return this.DrawCircle(element)
      case 'line':
        return this.DrawLine(element)
      case 'rectangle':
        return this.DrawRectangle(element)
      default:
        const msg = `Element ${element} not recognized as a drawable element.`
        throw new Error(msg)
    }
  }

  public DrawLine(element: Line): this {
    const { a, b, c, d, e, f } = element.transformation

    this.ctx.save()
    this.ctx.setTransform(a, b, c, d, e, f)
    this.ctx.beginPath()
    this.ctx.moveTo(IDENTITY_LINE_START.x, IDENTITY_LINE_START.y)
    this.ctx.lineTo(IDENTITY_LINE_END.x, IDENTITY_LINE_END.y)
    this.ctx.restore()
    this.setStroke(element)

    return this
  }

  public DrawRectangle(element: Rectangle): this {
    const { a, b, c, d, e, f } = element.transformation

    this.ctx.save()
    this.ctx.setTransform(a, b, c, d, e, f)
    this.ctx.beginPath()
    this.ctx.rect(
      IDENTITY_RECTANGLE_TL.x,
      IDENTITY_RECTANGLE_TL.y,
      IDENTITY_RECTANGLE_BR.x - IDENTITY_RECTANGLE_TL.x,
      IDENTITY_RECTANGLE_BR.y - IDENTITY_RECTANGLE_TL.y,
    )
    this.ctx.restore()
    this.setFill(element)
    this.setStroke(element)

    return this
  }

  public DrawCircle(element: Circle): this {
    const { a, b, c, d, e, f } = element.transformation

    this.ctx.save()
    this.ctx.setTransform(a, b, c, d, e, f)
    this.ctx.beginPath()
    this.ctx.arc(IDENTITY_ORIGIN.x, IDENTITY_ORIGIN.y, IDENTITY_RADIUS, 0, Math.PI * 2)
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
