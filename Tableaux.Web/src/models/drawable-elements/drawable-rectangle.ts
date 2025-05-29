import type { DrawableElement } from "./drawable-element";

export class DrawableRectangle implements DrawableElement {
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number,
    public color: string = 'red'
  ) {}
}