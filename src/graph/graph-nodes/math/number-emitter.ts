import { GraphNode } from '../../core/graph-node'
import type { GraphNodeOutputType } from '../../core/graph-node-output'
import { GraphNodeType } from '../decorators'

@GraphNodeType('Math', 'Number Emitter')
export class NumberEmitter extends GraphNode {
  private readonly output: GraphNodeOutputType<number>

  constructor(id: string, path: string[]) {
    super(id, path)

    this.output = this.registerNumberOutput('Number')
  }

  override onInitialize(): void {
    super.onInitialize()
    
    if (!this.data.value) this.data.value = 0
    this.solve()
  }

  public onChange(newValue: number): void {
    this.arm()
    this.data.value = newValue
    this.complete()
  }

  protected solve(): void {
    this.output.next(this.data.value as number)
  }
}
