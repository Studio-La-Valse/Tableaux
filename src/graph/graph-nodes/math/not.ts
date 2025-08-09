import { GraphNode } from '../../core/graph-node'
import { GraphNodeType } from '../decorators'

@GraphNodeType('Math', 'Not')
export class Not extends GraphNode {
  private input
  private output

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input = this.registerNumberInput('Values')
    this.output = this.registerBooleanOutput('Inverted')
  }

  protected async solve(): Promise<void> {
    this.input.payload.map((v) => !v).forEach((v) => this.output.next(v))
  }
}
