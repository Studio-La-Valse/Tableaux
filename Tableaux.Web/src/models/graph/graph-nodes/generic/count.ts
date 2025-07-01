import { GraphNode } from "../../core/graph-node";

export class Count extends GraphNode {

  private input
  private output

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input = this.registerUnkownInput()
    this.output = this.registerNumberOutput()
  }

  protected solve(): void {
    this.output.next(this.input.payloadLength);
  }
}
