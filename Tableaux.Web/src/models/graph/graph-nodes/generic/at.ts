import { GraphNode } from "../../core/graph-node";

export class At extends GraphNode {

  private input
  private input2
  private output

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input = this.registerUnkownInput()
    this.input2 = this.registerNumberInput()
    this.output = this.registerUnkownOutput()
  }

  protected solve(): void {
    this.input2.payload.map((v) => this.input.payload[v]).forEach((v) => this.output.next(v))
  }

}
