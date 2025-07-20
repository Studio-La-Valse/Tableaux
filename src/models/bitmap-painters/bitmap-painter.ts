import type { DrawableGeometry } from '../geometry/geometry'

export abstract class BitmapPainter {
  public DrawElements(elements: Iterable<DrawableGeometry>): BitmapPainter {
    for (const element of elements) {
      this.DrawElement(element)
    }

    return this
  }

  public abstract Init(
    width: number,
    height: number,
    translateX: number,
    translateY: number,
    zoom: number,
  ): BitmapPainter
  public abstract DrawElement(element: DrawableGeometry): BitmapPainter
  public abstract Finish(): BitmapPainter
}
