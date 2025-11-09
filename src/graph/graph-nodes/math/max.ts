import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { GraphNode } from '../../core/graph-node'
import { GraphNodeType } from '../decorators'

@GraphNodeType('Math', 'Max')
export class Max extends GraphNode {
  private params
  private output

  constructor(modelId: string) {
    super(modelId)

    this.params = this.registerNumberInputParams('Value')
    this.output = this.registerNumberOutput('Result')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const values of inputIterators.cycleValues(...this.params)) {
      const v = Math.max(...values)
      this.output.next(v)
    }
  }
}
