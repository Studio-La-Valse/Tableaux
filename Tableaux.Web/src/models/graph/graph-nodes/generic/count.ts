import { GraphNode } from "../../core/graph-node";

export class Count extends GraphNode {

  private input
  private output

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input = this.registerUnkownInput()
    this.output = this.registerNumberInput()
  }

  protected solve(): void {
    this.output.onNext(this.input.payloadLength);
  }
}
