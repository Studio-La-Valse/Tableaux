import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { GraphNode } from '../../core/graph-node'
import { GraphNodeType } from '../decorators'

@GraphNodeType('Math', 'Any')
export class Any extends GraphNode {
  private input1
  private output

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input1 = this.registerBooleanInput('Values')
    this.output = this.registerBooleanOutput('Any')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    let res = false
    for await (const v of inputIterators.createGenerator(this.input1)) {
      if (v) {
        res = true
        break
      }
    }
    this.output.next(res)
  }
}
