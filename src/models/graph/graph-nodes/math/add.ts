import { GraphNode } from '../../core/graph-node'
import { inputIterators } from '../../core/input-iterators'
import { GraphNodeType } from '../decorators'

@GraphNodeType('Math', 'Add')
export class Add extends GraphNode {
  private params
  private output

  constructor(id: string, path: string[]) {
    super(id, path)

    this.params = this.registerNumberInputParams('First')
    this.output = this.registerNumberOutput('Result')
  }

  protected solve(): void {
    inputIterators
      .cycleValues(...this.params)
      .map((values) => values.reduce((p, c) => p + c))
      .forEach((v) => this.output.next(v))
  }
}
