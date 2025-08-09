import { GraphNode } from '../../core/graph-node'
import { inputIterators } from '../../core/input-iterators'
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

  protected async solve(): Promise<void> {
    const [start, stop, step] = inputIterators.singletonOnly(this.input1, this.input2, this.input3)

    if (step <= 0) {
      const msg = `Invalid input, stepsize smaller or equal to 0`
      throw new Error(msg)
    }

    for (let index = start; index < stop; index += step) {
      this.output.next(index)
    }
  }
}
