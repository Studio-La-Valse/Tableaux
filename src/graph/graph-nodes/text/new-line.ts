import { GraphNode } from '../../core/graph-node'
import type { GraphNodeOutputType } from '../../core/graph-node-output'
import { GraphNodeType } from '../decorators'

@GraphNodeType('Text', 'New Line')
export class NewLine extends GraphNode {
  private output: GraphNodeOutputType<string>

  constructor(id: string, path: string[]) {
    super(id, path)

    this.output = this.registerStringOutput('Character')
  }

  protected async solve(): Promise<void> {
    const text = '\n'
    this.output.next(text)
  }
}
