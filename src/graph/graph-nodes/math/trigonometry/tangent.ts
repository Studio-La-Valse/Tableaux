import { inputIterators } from '@/graph/core/input-iterators'
import { GraphNode } from '../../../core/graph-node'
import { GraphNodeType } from '../../decorators'

@GraphNodeType('Math', 'Trigonometry', 'Tangent')
export class Tangent extends GraphNode {
  private input
  private output

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input = this.registerNumberInput('Angle (Radians)')
    this.output = this.registerNumberOutput('Tangent Value')
  }

  protected async solve(): Promise<void> {
    inputIterators
      .cycleValues(this.input)
      .map(([angle]) => Math.tan(angle))
      .forEach((result) => this.output.next(result))
  }
}
