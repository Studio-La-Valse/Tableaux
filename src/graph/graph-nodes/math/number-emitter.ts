import NumberPanel from '@/components/graph/Panels/NumberPanel.vue'
import { GraphNode } from '../../core/graph-node'
import type { GraphNodeOutputType } from '../../core/graph-node-output'
import { GraphNodePanel, GraphNodeType } from '../decorators'

@GraphNodeType('Math', 'Number Emitter')
@GraphNodePanel(NumberPanel)
export class NumberEmitter extends GraphNode {
  private readonly output: GraphNodeOutputType<number>

  public override data: { value: number } = { value: 0 }

  constructor(id: string, path: string[]) {
    super(id, path)

    this.output = this.registerNumberOutput('Number')
  }

  public onChange(newValue: number): void {
    this.arm()
    this.data.value = newValue
    this.complete()
  }

  protected solve(): void {
    this.output.next(this.data.value)
  }
}
