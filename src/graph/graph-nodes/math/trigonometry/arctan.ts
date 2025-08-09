import { inputIterators } from '@/graph/core/input-iterators'
import { GraphNode } from '../../../core/graph-node'
import { GraphNodeType } from '../../decorators'

@GraphNodeType('Math', 'Trigonometry', 'Arctan')
export class Arctan extends GraphNode {
  private input
  private output

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input = this.registerNumberInput('Tangent Value')
    this.output = this.registerNumberOutput('Angle (Radians)')
  }

  protected async solve(): Promise<void> {
    inputIterators
      .cycleValues(this.input)
      .map(([value]) => Math.atan(value))
      .forEach((result) => this.output.next(result))
  }
}
