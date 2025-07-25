import type { ColorARGB } from '@/models/geometry/color'
import { GraphNode } from '../../core/graph-node'
import { inputIterators } from '../../core/input-iterators'
import { GraphNodeType } from '../decorators'
import type { Line as line, DrawableLine as drawableLine } from '@/models/geometry/line'

@GraphNodeType('Canvas', 'Drawable Line')
export class DrawableLine extends GraphNode {
  private input1
  private input2
  private input3
  private output

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input1 = this.registerObjectInput<line>('Line')
    this.input2 = this.registerObjectInput<ColorARGB>('Stroke')
    this.input3 = this.registerNumberInput('StrokeWidth')
    this.output = this.registerObjectOutput<drawableLine>('Line')
  }

  protected solve(): void {
    inputIterators
      .cycleValues(this.input1, this.input2, this.input3)
      .map(([line, stroke, strokeWidth]) => ({ ...line, stroke, strokeWidth }))
      .forEach((v) => this.output.next(v))
  }
}
