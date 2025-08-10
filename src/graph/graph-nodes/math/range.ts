import { GraphNode } from '../../core/graph-node'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { GraphNodeType } from '../decorators'

@GraphNodeType('Math', 'Range')
export class Range extends GraphNode {
  private input1
  private input2
  private input3
  private output

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input1 = this.registerNumberInput('Start')
    this.input2 = this.registerNumberInput('Stop')
    this.input3 = this.registerNumberInput('Step')
    this.output = this.registerNumberOutput('Values')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    const [start, stop, step] = inputIterators.singletonOnly(this.input1, this.input2, this.input3)

    if (step <= 0) {
      const msg = `Invalid input, stepsize smaller or equal to 0`
      throw new Error(msg)
    }

    for await (const i of inputIterators.createRange(start, stop, step)) {
      this.output.next(i)
    }
  }
}
