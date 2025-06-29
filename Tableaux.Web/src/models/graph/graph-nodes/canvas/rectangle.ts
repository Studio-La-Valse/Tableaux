import { DrawableRectangle } from '@/models/drawable-elements/drawable-rectangle'
import { GraphNode } from '../../core/graph-node'

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
    const length = this.getEqualLength()

    for (let index = 0; index < length; index++) {
      const element = new DrawableRectangle(
        this._x1.payload[index],
        this._y1.payload[index],
        this.__width.payload[index],
        this.__height.payload[index],
        this.color.payload[index],
      )

      this.output.next(element)
    }
  }
}
