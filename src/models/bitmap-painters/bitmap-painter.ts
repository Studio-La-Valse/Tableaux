import { isCircle, type Circle } from '../geometry/circle'
import { formatCSSRGBA } from '../geometry/color-rgb'
import { hasFill, type Fill } from '../geometry/fill'
import type { Geometry } from '../geometry/geometry'
import { isLine, type Line } from '../geometry/line'
import { isRectangle, type Rectangle } from '../geometry/rectangle'
import { hasRotation, type Rotation } from '../geometry/rotation'
import { hasStroke, type Stroke } from '../geometry/stroke'

export class BitmapPainter {
  constructor(private canvas: CanvasRenderingContext2D) {}

  public Init(width: number, height: number): BitmapPainter {
    this.canvas.save()

    this.canvas.imageSmoothingEnabled = false

    this.resetFill()
    this.resetStroke()
    this.resetTransform()
    this.canvas.clearRect(0, 0, width, height)

    return this
  }

  public DrawElements(elements: Iterable<Geometry>): BitmapPainter {
    for (const element of elements) {
      this.DrawElement(element)
    }

    return this
  }

  public DrawElement(element: Geometry): BitmapPainter {
    this.resetFill()
    if (hasFill(element)) this.setFill(element)

    this.resetStroke()
    if (hasStroke(element)) this.setStroke(element)

    this.resetTransform()
    if (hasRotation(element)) this.setRotation(element)

    if (isLine(element)) {
      return this.DrawLine(element)
    }

    if (isRectangle(element)) {
      return this.DrawRectangle(element)
    }

    if (isCircle(element)) {
      return this.DrawCircle(element)
    }

    const msg = `Element ${element} not recognized as a drawable element.`
    throw new Error(msg)
  }

  public DrawLine(element: Line): BitmapPainter {
    this.canvas.beginPath()
    this.canvas.moveTo(element.start.x, element.start.y)
    this.canvas.lineTo(element.end.x, element.end.y)
    this.canvas.stroke()

    return this
  }

  public DrawRectangle(element: Rectangle): BitmapPainter {
    this.canvas.beginPath()
    this.canvas.rect(element.topLeft.x, element.topLeft.y, element.width, element.height)
    this.canvas.fill()
    this.canvas.stroke()

    return this
  }

  public DrawCircle(element: Circle): BitmapPainter {
    this.canvas.beginPath()
    this.canvas.arc(element.origin.x, element.origin.y, element.radius, 0, Math.PI * 2)
    this.canvas.fill()
    this.canvas.stroke()

    return this
  }

  public setFill(element: Fill) {
    this.canvas.fillStyle = formatCSSRGBA(element.fill)
  }

  public resetFill() {
    this.canvas.fillStyle = ''
  }

  public setStroke(element: Stroke) {
    this.canvas.strokeStyle = formatCSSRGBA(element.stroke)
    this.canvas.lineWidth = element.strokeWidth
  }

  public resetStroke() {
    this.canvas.strokeStyle = ''
    this.canvas.lineWidth = 0
  }

  public setRotation(element: Rotation) {
    this.canvas.translate(element.origin.x, element.origin.y)
    this.canvas.rotate(element.angle)
    this.canvas.translate(-element.origin.x, -element.origin.y)
  }

  public resetTransform() {
    this.canvas.setTransform(1, 0, 0, 1, 0, 0)
  }

  public Finish(): BitmapPainter {
    this.canvas.restore()
    return this
  }
}
