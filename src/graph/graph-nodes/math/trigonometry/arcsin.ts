import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { GraphNode } from '../../../core/graph-node'
import { GraphNodeType } from '../../decorators'

@GraphNodeType('Math', 'Trigonometry', 'Arcsin')
export class Arcsin extends GraphNode {
  private input
  private output

  constructor(modelId: string) {
    super(modelId)

    this.input = this.registerNumberInput('Sine Value')
    this.output = this.registerNumberOutput('Angle (Radians)')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [value] of inputIterators.cycleValues(this.input)) {
      const result = Math.asin(value)
      this.output.next(result)
    }
  }
}
