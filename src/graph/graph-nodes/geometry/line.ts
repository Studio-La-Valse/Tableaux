import { GraphNode } from '../../core/graph-node'
import { inputIterators } from '../../core/input-iterators'
import { GraphNodeType } from '../decorators'
import { assertIsXY } from '@/geometry/xy'
import { createLine, type Line as line } from '@/geometry/line'

@GraphNodeType('Geometry', 'Line')
export class Line extends GraphNode {
  private input1
  private input2
  private output

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input1 = this.registerObjectInput('Start')
    this.input2 = this.registerObjectInput('End')
    this.output = this.registerObjectOutput<line>('Line')
  }

  protected async solve(): Promise<void> {
    inputIterators
      .cycleValues(this.input1, this.input2)
      .map(([_start, _end]) => {
        const start = assertIsXY(_start)
        const end = assertIsXY(_end)
        return createLine(start, end)
      })
      .forEach((v) => this.output.next(v))
  }
}
