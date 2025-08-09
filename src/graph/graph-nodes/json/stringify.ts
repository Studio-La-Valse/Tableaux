import { GraphNode } from '../../core/graph-node'
import { GraphNodeType } from '../decorators'

@GraphNodeType('JSON', 'Stringify')
export class Stringify extends GraphNode {
  private input
  private output

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input = this.registerUnkownInput('JSON')
    this.output = this.registerStringOutput('String')
  }

  protected async solve(): Promise<void> {
    this.input.payload.forEach((v) => this.output.next(JSON.stringify(v)))
  }
}
