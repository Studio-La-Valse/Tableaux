import { inputIterators } from '@/models/graph/core/input-iterators'
import { GraphNode } from '../../../core/graph-node'
import { GraphNodeType } from '../../decorators'

@GraphNodeType('Math', 'Trigonometry', 'Degrees to Radians')
export class DegreesToRadians extends GraphNode {
  private input
  private output

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input = this.registerNumberInput('Degrees')
    this.output = this.registerNumberOutput('Radians')
  }

  protected solve(): void {
    inputIterators
      .cycleValues(this.input)
      .map(([a]) => a * (Math.PI / 180))
      .forEach((result) => this.output.next(result))
  }
}
