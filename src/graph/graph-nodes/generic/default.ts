import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { GraphNode } from '@/graph/core/graph-node'

export class Default extends GraphNode {
  private in
  private default
  private out

  constructor(modelId: string) {
    super(modelId)

    this.in = this.registerUnknownInput('Input')
    this.default = this.registerUnknownInput('Default Value')
    this.out = this.registerUnknownOutput('Output')
  }

  protected override async solve(iterators: InputIteratorsAsync): Promise<void> {
    const length = this.in.payloadLength
    let payload = this.in

    if (length === 0) {
      const defaultLength = this.default.payloadLength
      if (defaultLength === 0) {
        throw new Error('Both the input and the default are empty')
      }

      payload = this.default
    }

    for await (const value of iterators.createGenerator(payload)) {
      this.out.next(value)
    }
  }
}
