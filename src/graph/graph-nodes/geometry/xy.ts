import { GraphNode } from '../../core/graph-node'
import { inputIterators } from '../../core/input-iterators'
import { GraphNodeType } from '../decorators'
import { type XY as xy } from '@/geometry/xy'

@GraphNodeType('Geometry', 'XY')
export class XY extends GraphNode {
  private input1
  private input2
  private output

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input1 = this.registerNumberInput('X')
    this.input2 = this.registerNumberInput('Y')
    this.output = this.registerObjectOutput<xy>('XY')
  }

  protected async solve(): Promise<void> {
    inputIterators
      .cycleValues(this.input1, this.input2)
      .map(([x, y]) => ({ x, y }))
      .forEach((v) => this.output.next(v))
  }
}
