import { inputIterators } from '@/models/graph/core/input-iterators'
import { GraphNode } from '../../../core/graph-node'
import { GraphNodeType } from '../../decorators'

@GraphNodeType('Math', 'Trigonometry', 'Cosine')
export class Cosine extends GraphNode {
  private input
  private output

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input = this.registerNumberInput('Angle (Radians)')
    this.output = this.registerNumberOutput('Cosine Value')
  }

  protected solve(): void {
    inputIterators
      .cycleValues(this.input)
      .map(([angle]) => Math.cos(angle))
      .forEach((result) => this.output.next(result))
  }
}
