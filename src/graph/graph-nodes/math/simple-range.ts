import { GraphNode } from '../../core/graph-node'
import { inputIterators } from '../../core/input-iterators'
import { GraphNodeType } from '../decorators'

@GraphNodeType('Math', 'Simple Range')
export class SimpleRange extends GraphNode {
  private input
  private output

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input = this.registerNumberInput('Length')
    this.output = this.registerNumberOutput('Values')
  }

  protected async solve(): Promise<void> {
    const [stop] = inputIterators.singletonOnly(this.input)
    for (let index = 0; index < stop; index++) {
      this.output.next(index)
    }
  }
}
