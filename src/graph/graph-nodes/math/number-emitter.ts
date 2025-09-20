import NumberPanel from '@/components/graph/Panels/NumberPanel.vue'
import type { GraphNodeOutputType } from '../../core/graph-node-output'
import { GraphNodePanel, GraphNodeType } from '../decorators'
import { Emitter } from '@/graph/core/emitter'

@GraphNodeType('Math', 'Number Emitter')
@GraphNodePanel(NumberPanel)
export class NumberEmitter extends Emitter<number> {
  public override type: 'number' | 'text' = 'number'

  private readonly output: GraphNodeOutputType<number>

  constructor(id: string, path: string[]) {
    super(id, path, 0)

    this.output = this.registerNumberOutput('Number')
  }

  protected async solve(): Promise<void> {
    this.output.next(this.data.value)
  }
}
