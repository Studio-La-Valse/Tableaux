import { GraphNode } from "../../core/graph-node"

export class SimpleRange extends GraphNode {
  private input
  private output

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input = this.registerNumberInput()
    this.output = this.registerNumberOutput()
  }

  protected solve(): void {
    const count = this.input.payload[0]

    for (let index = 0; index < count; index += 1) {
      this.output.next(index)
    }
  }
}
