import { GraphNode } from '../../core/graph-node'
import type { GraphNodeInputType } from '../../core/graph-node-input'
import type { GraphNodeOutputType } from '../../core/graph-node-output'
import { inputIterators } from '../../core/input-iterators'

export class Multiply extends GraphNode {
  private params: GraphNodeInputType<number>[]
  private output: GraphNodeOutputType<number>

  constructor(id: string, path: string[]) {
    super(id, path)

    this.params = this.registerNumberInputParams('First')
    this.output = this.registerNumberOutput('Result')
  }

  protected solve(): void {
    inputIterators
      .cycleValues(...this.params)
      .map((values) => values.reduce((p, c) => p * c))
      .forEach((v) => this.output.next(v))
  }
}
