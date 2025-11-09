import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { GraphNode } from '@/graph/core/graph-node'

export class Reverse extends GraphNode {
  private in
  private out

  constructor(modelId: string) {
    super(modelId)

    this.in = this.registerUnknownInput('Input')
    this.out = this.registerUnknownOutput('Output')
  }

  protected async solve(iterators: InputIteratorsAsync): Promise<void> {
    for await (const value of iterators.createGeneratorReversed(this.in)) {
      this.out.next(value)
    }
  }
}
