import { type ColorRGB } from '@/models/geometry/color'
import { GraphNode } from '../../core/graph-node'
import { inputIterators } from '../../core/input-iterators'
import { GraphNodeType } from '../decorators'
import type { Circle as circle, DrawableCircle as drawableCircle } from '@/models/geometry/circle'

@GraphNodeType('Canvas', 'Drawable Circle')
export class DrawableCircle extends GraphNode {
  private input1
  private input2
  private input3
  private input4
  private output

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input1 = this.registerObjectInput<circle>('Circle')
    this.input2 = this.registerObjectInput<ColorRGB>('Fill')
    this.input3 = this.registerObjectInput<ColorRGB>('Stroke')
    this.input4 = this.registerNumberInput('StrokeWidth')
    this.output = this.registerObjectOutput<drawableCircle>('Circle')
  }

  protected solve(): void {
    inputIterators
      .cycleValues(this.input1, this.input2, this.input3, this.input4)
      .map(([circle, fill, stroke, strokeWidth]) => ({ ...circle, fill, stroke, strokeWidth }))
      .forEach((v) => this.output.next(v))
  }
}
