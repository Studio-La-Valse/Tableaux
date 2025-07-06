import type { DrawableElement } from './drawable-element'

export class DrawableCircle implements DrawableElement {
  constructor(
    public x: number,
    public y: number,
    public radius: number,
    public color: string,
  ) {}
}
