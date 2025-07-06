import { DrawableCircle } from '../drawable-elements/drawable-circle'
import type { DrawableElement } from '../drawable-elements/drawable-element'
import { DrawableLine } from '../drawable-elements/drawable-line'
import { DrawableRectangle } from '../drawable-elements/drawable-rectangle'
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

  public DrawElement(element: DrawableElement): BitmapPainter {
    if (element instanceof DrawableLine) {
      return this.DrawLine(this.canvas, element)
    }

    if (element instanceof DrawableRectangle) {
      return this.DrawRectangle(this.canvas, element)
    }

    if (element instanceof DrawableCircle) {
      return this.DrawCircle(this.canvas, element)
    }

    const msg = `Element ${element} not recognized as a drawable element.`
    throw new Error(msg)
  }

  public DrawRectangle(
    bitmap: CanvasRenderingContext2D,
    element: DrawableRectangle,
  ): BitmapPainter {
    bitmap.fillStyle = element.color
    bitmap.fillRect(element.x, element.y, element.width, element.height)
    return this
  }

  public DrawCircle(bitmap: CanvasRenderingContext2D, element: DrawableCircle): BitmapPainter {
    bitmap.fillStyle = element.color
    bitmap.beginPath()
    bitmap.arc(element.x, element.y, element.radius, 0, Math.PI * 2)
    bitmap.fill()
    return this
  }

  public DrawLine(bitmap: CanvasRenderingContext2D, element: DrawableLine): BitmapPainter {
    bitmap.strokeStyle = element.color
    bitmap.lineWidth = element.width

    bitmap.beginPath()
    bitmap.moveTo(element.x1, element.y1)
    bitmap.lineTo(element.x2, element.y2)
    bitmap.stroke()

    return this
  }

  public Finish(): BitmapPainter {
    this.canvas.restore()
    return this
  }
}
