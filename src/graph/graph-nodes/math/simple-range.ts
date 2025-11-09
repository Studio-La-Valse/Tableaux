import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { GraphNode } from '../../core/graph-node'
import { GraphNodeType } from '../decorators'

@GraphNodeType('Math', 'Simple Range')
export class SimpleRange extends GraphNode {
  private input
  private output

  constructor(modelId: string) {
    super(modelId)

    this.input = this.registerNumberInput('Length')
    this.output = this.registerNumberOutput('Values')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    const [stop] = inputIterators.singletonOnly(this.input)

    for await (const i of inputIterators.createRange(0, stop, 1)) {
      this.output.next(i)
    }
  }
}
