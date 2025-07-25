import { inputIterators } from '@/models/graph/core/input-iterators'
import { GraphNode } from '../../../core/graph-node'
import { GraphNodeType } from '../../decorators'

@GraphNodeType('Math', 'Trigonometry', 'Radians to Degrees')
export class RadiansToDegrees extends GraphNode {
  private input
  private output

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input = this.registerNumberInput('Radians')
    this.output = this.registerNumberOutput('Degrees')
  }

  protected solve(): void {
    inputIterators
      .cycleValues(this.input)
      .map(([r]) => r * (180 / Math.PI))
      .forEach((result) => this.output.next(result))
  }
}
