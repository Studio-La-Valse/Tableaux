import { GraphNode } from '../../core/graph-node'
import type { GraphNodeInputNumber } from '../../core/graph-node-input'
import type { GraphNodeOutputType } from '../../core/graph-node-output'
import { inputIterators } from '../../core/input-iterators'

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
    inputIterators.cycleValues(this.input1, this.input2)
      .map(([first, second]) => first + second)
      .forEach((v) => this.output.next(v))
  }
}
