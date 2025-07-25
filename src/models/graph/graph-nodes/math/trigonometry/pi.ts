import { GraphNode } from '../../../core/graph-node'
import type { GraphNodeOutputType } from '../../../core/graph-node-output'
import { GraphNodeType } from '../../decorators'

@GraphNodeType('Math', 'Trigonometry', 'Pi')
export class NumberEmitter extends GraphNode {
  private readonly output: GraphNodeOutputType<number>

  constructor(id: string, path: string[]) {
    super(id, path)

    this.output = this.registerNumberOutput('Number')
  }

  protected solve(): void {
    this.output.next(Math.PI)
  }
}
