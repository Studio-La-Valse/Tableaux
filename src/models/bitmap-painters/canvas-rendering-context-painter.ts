import { isDrawableCircle, type DrawableCircle } from '../geometry/circle'
import type { DrawableGeometry } from '../geometry/geometry'
import { isDrawableLine, type DrawableLine } from '../geometry/line'
import { isDrawableRectangle, type DrawableRectangle } from '../geometry/rectangle'
import { BitmapPainter } from './bitmap-painter'

export class CanvasRenderingContextPainter extends BitmapPainter {
  constructor(private canvas: CanvasRenderingContext2D) {
    super()
  }

  public Init(width: number, height: number): BitmapPainter {
    this.canvas.save()

    this.canvas.imageSmoothingEnabled = false

    this.canvas.clearRect(0, 0, width, height)

    return this
  }

  public DrawElement(element: DrawableGeometry): BitmapPainter {
    if (isDrawableLine(element)) {
      return this.DrawLine(this.canvas, element)
    }

    if (isDrawableRectangle(element)) {
      return this.DrawRectangle(this.canvas, element)
    }

    if (isDrawableCircle(element)) {
      return this.DrawCircle(this.canvas, element)
    }

    const msg = `Element ${element} not recognized as a drawable element.`
    throw new Error(msg)
  }

  public DrawLine(bitmap: CanvasRenderingContext2D, element: DrawableLine): BitmapPainter {
    bitmap.strokeStyle = element.stroke
    bitmap.lineWidth = element.strokeWidth

    bitmap.beginPath()
    bitmap.moveTo(element.start.x, element.start.y)
    bitmap.lineTo(element.end.x, element.end.y)
    bitmap.stroke()

    return this
  }

  public DrawRectangle(
    bitmap: CanvasRenderingContext2D,
    element: DrawableRectangle,
  ): BitmapPainter {
    bitmap.fillStyle = element.fill
    bitmap.strokeStyle = element.stroke
    bitmap.lineWidth = element.strokeWidth

    bitmap.beginPath()
    bitmap.rect(element.topLeft.x, element.topLeft.y, element.width, element.height)
    bitmap.fill()
    bitmap.stroke()

    return this
  }

  public DrawCircle(bitmap: CanvasRenderingContext2D, element: DrawableCircle): BitmapPainter {
    bitmap.fillStyle = element.fill
    bitmap.strokeStyle = element.stroke
    bitmap.lineWidth = element.strokeWidth

    bitmap.beginPath()
    bitmap.arc(element.origin.x, element.origin.y, element.radius, 0, Math.PI * 2)
    bitmap.fill()
    bitmap.stroke()

    return this
  }

  public Finish(): BitmapPainter {
    this.canvas.restore()
    return this
  }
}
