import type { GraphNodeInputType } from '../../core/graph-node-input'
import { GraphNode } from '../../core/graph-node'

export class Logger extends GraphNode {
  private input: GraphNodeInputType<string>

  public values: string[] = [];

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input = this.registerStringInput()
  }

  public arm(): void {
    if (this.values) {
      this.values.length = 0
    }
    super.arm()
  }

  public solve(): void {
    const values = this.input.payload
    this.values = [...values]
  }
}
