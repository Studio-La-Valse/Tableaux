import type { DrawableElement } from "../drawable-elements/drawable-element";

export abstract class BitmapPainter{
    public DrawElements(elements: Iterable<DrawableElement>): BitmapPainter{
        for (let element of elements){
            this.DrawElement(element)
        }

        return this;
    }

    public abstract Init(width: number, height: number, translateX: number, translateY: number, zoom: number): BitmapPainter;
    public abstract DrawElement(element: DrawableElement): BitmapPainter;
    public abstract Finish(): BitmapPainter;
}
