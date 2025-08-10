import { GraphNode } from '../../core/graph-node'
import type { GraphNodeInputString } from '../../core/graph-node-input'
import type { GraphNodeOutputType } from '../../core/graph-node-output'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { GraphNodeType } from '../decorators'

@GraphNodeType('Text', 'Split')
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

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [left, right] of inputIterators.cycleValues(this.input1, this.input2)) {
      const result = left.split(right)
      result.forEach((v) => this.output.next(v))
    }
  }
}
