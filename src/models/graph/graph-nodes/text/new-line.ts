import { GraphNode } from '../../core/graph-node'
import type { GraphNodeOutputType } from '../../core/graph-node-output'

export class NewLine extends GraphNode {
  private output: GraphNodeOutputType<string>

  constructor(id: string, path: string[]) {
    super(id, path)

    this.output = this.registerStringOutput('Character')
  }

  override onInitialize(): void {
    this.solve()
  }

  protected solve(): void {
    const text = '\n'
    this.output.next(text)
  }
}
