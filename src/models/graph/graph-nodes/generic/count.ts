import { GraphNode } from "../../core/graph-node";
import { GraphNodeType } from '../decorators'

@GraphNodeType('Generic', 'Count')
export class Count extends GraphNode {

  private input
  private output

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input = this.registerUnkownInput("Signal")
    this.output = this.registerNumberOutput("Count")
  }

  protected solve(): void {
    this.output.next(this.input.payloadLength);
  }
}
