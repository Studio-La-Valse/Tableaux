import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { GraphNode } from '../../core/graph-node'
import { GraphNodeType } from '../decorators'

@GraphNodeType('Math', 'Modulo')
export class Modulo extends GraphNode {
  private input1
  private input2
  private output

  constructor(modelId: string) {
    super(modelId)

    this.input1 = this.registerNumberInput('Values')
    this.input2 = this.registerNumberInput('Factor')
    this.output = this.registerNumberOutput('Result')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [a, b] of inputIterators.cycleValues(this.input1, this.input2)) {
      if (b <= 0) {
        throw new Error('Value cannot be equal to or smaller than 0')
      }

      let v = a
      while (v < b) {
        v += b
      }
      const result = v % b
      this.output.next(result)
    }
  }
}
