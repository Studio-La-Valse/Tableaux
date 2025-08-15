import { GraphNode } from '../../core/graph-node'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { GraphNodeType } from '../decorators'

@GraphNodeType('Math', 'Min')
export class Min extends GraphNode {
  private params
  private output

  constructor(id: string, path: string[]) {
    super(id, path)

    this.params = this.registerNumberInputParams('Value')
    this.output = this.registerNumberOutput('Result')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const values of inputIterators.cycleValues(...this.params)) {
      const v = Math.min(...values)
      this.output.next(v)
    }
  }
}
