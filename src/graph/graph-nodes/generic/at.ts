import { GraphNode } from '../../core/graph-node'
import { GraphNodeType } from '../decorators'

@GraphNodeType('Generic', 'At')
export class At extends GraphNode {
  private input
  private input2
  private output

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input = this.registerUnkownInput('Input')
    this.input2 = this.registerNumberInput('Index')
    this.output = this.registerUnkownOutput('Value')
  }

  protected async solve(): Promise<void> {
    this.input2.payload.map((v) => this.input.payload[v]).forEach((v) => this.output.next(v))
  }
}
