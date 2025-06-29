import type { DrawableElement } from './drawable-element'

export class DrawableLine implements DrawableElement {
  constructor(
    public x1: number,
    public y1: number,
    public x2: number,
    public y2: number,
    public color: string,
    public width: number,
  ) {}
}
