import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { GraphNode } from '../../core/graph-node'
import { GraphNodeType } from '../decorators'

@GraphNodeType('Math', 'Xor')
export class Xor extends GraphNode {
  private input1
  private input2
  private output

  constructor(modelId: string) {
    super(modelId)

    this.input1 = this.registerBooleanInput('First')
    this.input2 = this.registerBooleanInput('Second')
    this.output = this.registerBooleanOutput('Result')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [a, b] of inputIterators.cycleValues(this.input1, this.input2)) {
      const result = !(a || b)
      this.output.next(result)
    }
  }
}
