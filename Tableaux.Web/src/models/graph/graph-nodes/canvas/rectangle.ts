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

    this._x1 = this.registerNumberInput()
    this._y1 = this.registerNumberInput()
    this.__width = this.registerNumberInput()
    this.__height = this.registerNumberInput()
    this.color = this.registerStringInput()
    this.output = this.registerObjectOutput()
  }

  protected solve(): void {
    inputIterators.cycleMultiples(this._x1, this._y1, this.__width, this.__height, this.color).forEach(
      ([x, y, w, h, c]) => {
        this.output.next(new DrawableRectangle(x, y, w, h, c))
      },
    )
  }
}
