import { GraphNode } from '../../core/graph-node'

export class Not extends GraphNode {
  private input
  private output

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input = this.registerNumberInput("Values")
    this.output = this.registerBooleanOutput("Inverted")
  }

  protected solve(): void {
    this.input.payload.map((v) => !v).forEach((v) => this.output.next(v))
  }
}
