import { GraphNode } from '../../../core/graph-node'
import type { GraphNodeOutputType } from '../../../core/graph-node-output'
import { GraphNodeType } from '../../decorators'

@GraphNodeType('Math', 'Trigonometry', 'Pi')
export class Pi extends GraphNode {
  private readonly output: GraphNodeOutputType<number>

  constructor(id: string, path: string[]) {
    super(id, path)

    this.output = this.registerNumberOutput('Number')
  }

  protected async solve(): Promise<void> {
    this.output.next(Math.PI)
  }
}
