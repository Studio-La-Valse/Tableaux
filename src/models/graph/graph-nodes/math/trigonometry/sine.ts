import { inputIterators } from '@/models/graph/core/input-iterators'
import { GraphNode } from '../../../core/graph-node'
import { GraphNodeType } from '../../decorators'

@GraphNodeType('Math', 'Trigonometry', 'Sine')
export class Sine extends GraphNode {
  private input
  private output

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input = this.registerNumberInput('Angle (Radians)')
    this.output = this.registerNumberOutput('Sine Value')
  }

  protected solve(): void {
    inputIterators
      .cycleValues(this.input)
      .map(([angle]) => Math.sin(angle))
      .forEach((result) => this.output.next(result))
  }
}
