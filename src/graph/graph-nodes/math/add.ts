import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { GraphNode } from '../../core/graph-node'
import { GraphNodeType } from '../decorators'

@GraphNodeType('Math', 'Add')
export class Add extends GraphNode {
  private params
  private output

  constructor(modelId: string) {
    super(modelId)

    this.params = this.registerNumberInputParams('First')
    this.output = this.registerNumberOutput('Result')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const values of inputIterators.cycleValues(...this.params)) {
      const v = values.reduce((p, c) => p + c)
      this.output.next(v)
    }
  }
}
