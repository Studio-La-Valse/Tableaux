import { GraphNode } from '../../core/graph-node'
import type { GraphNodeInputNumber } from '../../core/graph-node-input'
import type { GraphNodeOutputType } from '../../core/graph-node-output'

export class Sum extends GraphNode {
  private input: GraphNodeInputNumber
  private output: GraphNodeOutputType<number>

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input = this.registerNumberInput("Values")
    this.output = this.registerNumberOutput("Sum")
  }

  protected solve(): void {
    const sum = this.input.payload.reduce((p, n) => p + n, 0)
    this.output.next(sum);
  }
}
