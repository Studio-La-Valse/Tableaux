import { GraphNode } from '../../core/graph-node'
import type { GraphNodeInputNumber } from '../../core/graph-node-input'
import type { GraphNodeOutputType } from '../../core/graph-node-output'

export class Add extends GraphNode {
  public path: string[] = ['Math', 'Add']

  private input1: GraphNodeInputNumber
  private input2: GraphNodeInputNumber
  private output: GraphNodeOutputType<number>

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input1 = this.registerNumberInput()
    this.input2 = this.registerNumberInput()
    this.output = this.registerNumberOutput()
  }

  protected solve(): void {
    const length = this.getLongest()

    for (let index = 0; index < length; index++) {
      const sum = this.input1.payload[index] + this.input2.payload[index]
      this.output.next(sum)
    }
  }
}
