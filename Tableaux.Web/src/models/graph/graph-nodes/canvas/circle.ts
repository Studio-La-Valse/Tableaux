import { DrawableCircle } from '@/models/drawable-elements/drawable-circle'
import { GraphNode } from '../../core/graph-node'

export class Circle extends GraphNode {
  private _x
  private _y
  private radius
  private color
  private output

  constructor(id: string, path: string[]) {
    super(id, path)

    this._x = this.registerNumberInput()
    this._y = this.registerNumberInput()
    this.radius = this.registerNumberInput()
    this.color = this.registerStringInput()
    this.output = this.registerObjectOutput()
  }

  protected solve(): void {
    const length = this.getEqualLength()

    for (let index = 0; index < length; index++) {
      const element = new DrawableCircle(
        this._x.payload[index],
        this._y.payload[index],
        this.radius.payload[index],
        this.color.payload[index],
      );

      this.output.next(element)
    }
  }
}
