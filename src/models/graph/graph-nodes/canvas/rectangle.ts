import { type ColorARGB } from '@/models/geometry/color'
import { GraphNode } from '../../core/graph-node'
import { inputIterators } from '../../core/input-iterators'
import { GraphNodeType } from '../decorators'
import type {
  Rectangle as rectangle,
  DrawableRectangle as drawableRectangle,
} from '@/models/geometry/rectangle'

@GraphNodeType('Canvas', 'Drawable Rectangle')
export class DrawableRectangle extends GraphNode {
  private input1
  private input2
  private input3
  private input4
  private output

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input1 = this.registerObjectInput<rectangle>('Rectangle')
    this.input2 = this.registerObjectInput<ColorARGB>('Fill')
    this.input3 = this.registerObjectInput<ColorARGB>('Stroke')
    this.input4 = this.registerNumberInput('StrokeWidth')
    this.output = this.registerObjectOutput<drawableRectangle>('Rectangle')
  }

  protected solve(): void {
    inputIterators
      .cycleValues(this.input1, this.input2, this.input3, this.input4)
      .map(([rect, fill, stroke, strokeWidth]) => ({ ...rect, fill, stroke, strokeWidth }))
      .forEach((v) => this.output.next(v))
  }
}
