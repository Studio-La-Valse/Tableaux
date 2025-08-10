import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
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

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [value] of inputIterators.cycleValues(this.input)) {
      const result = value * (Math.PI / 180)
      this.output.next(result)
    }
  }
}
