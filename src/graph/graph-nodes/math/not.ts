import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { GraphNode } from '../../core/graph-node'
import { GraphNodeType } from '../decorators'

@GraphNodeType('Math', 'Not')
export class Not extends GraphNode {
  private input
  private output

  constructor(modelId: string) {
    super(modelId)

    this.input = this.registerBooleanInput('Values')
    this.output = this.registerBooleanOutput('Inverted')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const v of inputIterators.createGenerator(this.input)) {
      const res = !v
      this.output.next(res)
    }
  }
}
