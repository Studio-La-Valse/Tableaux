import { GraphNode } from '../../core/graph-node'
import type { GraphNodeInputString } from '../../core/graph-node-input'
import type { GraphNodeOutputType } from '../../core/graph-node-output'
import { inputIterators } from '../../core/input-iterators'

export class Split extends GraphNode {
  public path: string[] = ['Text', 'Split']

  private input1: GraphNodeInputString
  private input2: GraphNodeInputString
  private output: GraphNodeOutputType<string>

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input1 = this.registerStringInput('Text')
    this.input2 = this.registerStringInput('Character')
    this.output = this.registerStringOutput('Result')
  }

  protected solve(): void {
    inputIterators.cycleValues(this.input1, this.input2).forEach(([left, right]) => {
      const result = left.split(right)
      result.forEach((v) => this.output.next(v))
    })
  }
}
