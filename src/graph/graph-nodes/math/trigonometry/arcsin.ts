import { inputIterators } from '@/graph/core/input-iterators'
import { GraphNode } from '../../../core/graph-node'
import { GraphNodeType } from '../../decorators'

@GraphNodeType('Math', 'Trigonometry', 'Arcsin')
export class Arcsin extends GraphNode {
  private input
  private output

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input = this.registerNumberInput('Sine Value')
    this.output = this.registerNumberOutput('Angle (Radians)')
  }

  protected solve(): void {
    inputIterators
      .cycleValues(this.input)
      .map(([value]) => Math.asin(value))
      .forEach((result) => this.output.next(result))
  }
}
