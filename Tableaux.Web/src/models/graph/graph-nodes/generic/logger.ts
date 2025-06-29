import type { GraphNodeInputType } from '../../core/graph-node-input'
import { GraphNode } from '../../core/graph-node'
import { reactive } from 'vue'

export class Logger extends GraphNode {
  private input: GraphNodeInputType<string>

  // a reactive array of strings
  public readonly values = reactive<string[]>([])

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input = this.registerStringInput()
  }

  public arm(): void {
    this.values.length = 0
    super.arm()
  }

  public solve(): void {
    this.values.length = 0
    this.input.payload.forEach((e) => this.values.push(e))
  }
}
