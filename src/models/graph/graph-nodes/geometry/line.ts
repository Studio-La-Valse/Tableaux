import { GraphNode } from '../../core/graph-node'
import { inputIterators } from '../../core/input-iterators'
import { GraphNodeType } from '../decorators'
import { type XY as xy } from '@/models/geometry/xy'
import { type Line as line } from '@/models/geometry/line'

@GraphNodeType('Geometry', 'Line')
export class Line extends GraphNode {
  private input1
  private input2
  private output

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input1 = this.registerObjectInput<xy>('Start')
    this.input2 = this.registerObjectInput<xy>('end')
    this.output = this.registerObjectOutput<line>('Circle')
  }

  protected solve(): void {
    inputIterators
      .cycleValues(this.input1, this.input2)
      .map(([start, end]) => ({ start, end }))
      .forEach((v) => this.output.next(v))
  }
}
