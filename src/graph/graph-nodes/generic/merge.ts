import type { GraphNodeInputType } from '../../core/graph-node-input'
import type { GraphNodeOutputType } from '../../core/graph-node-output'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { GraphNode } from '../../core/graph-node'
import { GraphNodeType } from '../decorators'

@GraphNodeType('Generic', 'Merge')
export class Merge extends GraphNode {
  private params: GraphNodeInputType<unknown>[]
  private output: GraphNodeOutputType<unknown>

  constructor(modelId: string) {
    super(modelId)

    this.params = this.registerUnkownInputParams('Values')
    this.output = this.registerUnknownOutput('Values')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for (const param of this.params) {
      for await (const value of inputIterators.createGenerator(param)) {
        this.output.next(value)
      }
    }
  }
}
