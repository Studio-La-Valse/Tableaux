import { GraphNode } from '../../core/graph-node'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { GraphNodeType } from '../decorators'

@GraphNodeType('Math', 'Subtract')
export class Subtract extends GraphNode {
  private input1
  private input2
  private output

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input1 = this.registerNumberInput('Left')
    this.input2 = this.registerNumberInput('Right')
    this.output = this.registerNumberOutput('Result')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [a, b] of inputIterators.cycleValues(this.input1, this.input2)) {
      const result = a - b
      this.output.next(result)
    }
  }
}
