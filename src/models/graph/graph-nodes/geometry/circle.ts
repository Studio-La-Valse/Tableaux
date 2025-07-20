import { GraphNode } from '../../core/graph-node'
import { inputIterators } from '../../core/input-iterators'
import { GraphNodeType } from '../decorators'
import { type XY } from '@/models/geometry/xy'
import { type Circle as circle } from '@/models/geometry/circle'

@GraphNodeType('Geometry', 'Circle')
export class Circle extends GraphNode {
  private input1
  private input2
  private output

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input1 = this.registerObjectInput<XY>('XY')
    this.input2 = this.registerNumberInput('Radius')
    this.output = this.registerObjectOutput<circle>('Circle')
  }

  protected solve(): void {
    inputIterators
      .cycleValues(this.input1, this.input2)
      .map(([xy, radius]) => ({ origin: xy, radius }))
      .forEach((v) => this.output.next(v))
  }
}
