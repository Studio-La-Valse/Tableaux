import { GraphNode } from '../../core/graph-node'
import type { GraphNodeInputNumber } from '../../core/graph-node-input'
import type { GraphNodeOutputType } from '../../core/graph-node-output'

export class Sum extends GraphNode {
  private input: GraphNodeInputNumber
  private output: GraphNodeOutputType<number>

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input = this.registerNumberInput()
    this.output = this.registerNumberOutput()
  }

  protected solve(): void {
    let sum = 0;

    for (let index = 0; index < this.input.payloadLength; index++) {
      sum += this.input.payload[index]
    }

    this.output.next(sum);
  }
}
