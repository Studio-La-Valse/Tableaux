import { DrawableCircle } from '@/models/drawable-elements/drawable-circle'
import { GraphNode } from '../../core/graph-node'
import { inputIterators } from '../../core/input-iterators'

export class Circle extends GraphNode {
  private _x
  private _y
  private radius
  private color
  private output

  constructor(id: string, path: string[]) {
    super(id, path)

    this._x = this.registerNumberInput("X")
    this._y = this.registerNumberInput("Y")
    this.radius = this.registerNumberInput("Radius")
    this.color = this.registerStringInput("Color")
    this.output = this.registerObjectOutput("Output")
  }

  protected solve(): void {
    inputIterators.cycleValues(this._x, this._y, this.radius, this.color).forEach(([x, y, r, c]) => {
      this.output.next(new DrawableCircle(x, y, r, c))
    });
  }
}
