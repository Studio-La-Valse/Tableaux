import { inputIterators } from '@/models/graph/core/input-iterators'
import { GraphNode } from '../../../core/graph-node'
import { GraphNodeType } from '../../decorators'

@GraphNodeType('Math', 'Trigonometry', 'Arccos')
export class Arccos extends GraphNode {
  private input
  private output

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input = this.registerNumberInput('Cosine Value')
    this.output = this.registerNumberOutput('Angle (Radians)')
  }

  protected solve(): void {
    inputIterators
      .cycleValues(this.input)
      .map(([value]) => Math.acos(value))
      .forEach((result) => this.output.next(result))
  }
}
