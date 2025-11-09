import { GraphNode } from '../../core/graph-node'
import { GraphNodeType } from '../decorators'

@GraphNodeType('Generic', 'Count')
export class Count extends GraphNode {
  private input
  private output

  constructor(modelId: string) {
    super(modelId)

    this.input = this.registerUnknownInput('Signal')
    this.output = this.registerNumberOutput('Count')
  }

  protected async solve(): Promise<void> {
    this.output.next(this.input.payloadLength)
  }
}
