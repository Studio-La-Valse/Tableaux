import { DrawableRectangle } from '@/models/drawable-elements/drawable-rectangle'
import { GraphNode } from '../../core/graph-node'
import { inputIterators } from '../../core/input-iterators'

export class Rectangle extends GraphNode {
  private _x1
  private _y1
  private __width
  private __height
  private color
  private output

  constructor(id: string, path: string[]) {
    super(id, path)

    this._x1 = this.registerNumberInput("X")
    this._y1 = this.registerNumberInput("Y")
    this.__width = this.registerNumberInput("Width")
    this.__height = this.registerNumberInput("Height")
    this.color = this.registerStringInput("Color")
    this.output = this.registerObjectOutput("Rectangle")
  }

  protected solve(): void {
    inputIterators.cycleValues(this._x1, this._y1, this.__width, this.__height, this.color).forEach(
      ([x, y, w, h, c]) => {
        this.output.next(new DrawableRectangle(x, y, w, h, c))
      },
    )
  }
}
