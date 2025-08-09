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

  protected async solve(): Promise<void> {
    this.output.next(this.input1.payload.some((v) => v))
  }
}
