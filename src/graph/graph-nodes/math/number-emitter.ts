import type { GraphNodeOutputType } from '../../core/graph-node-output'
import NumberPanel from '@/components/graph/Panels/NumberPanel.vue'
import { Emitter } from '@/graph/core/emitter'
import { GraphNodePanel, GraphNodeType } from '../decorators'

@GraphNodeType('Math', 'Number Emitter')
@GraphNodePanel(NumberPanel)
export class NumberEmitter extends Emitter<number> {
  public override type: 'number' | 'text' = 'number'

  private readonly output: GraphNodeOutputType<number>

  constructor(modelId: string) {
    super(modelId, 0)

    this.output = this.registerNumberOutput('Number')
  }

  protected async solve(): Promise<void> {
    this.output.next(this.data.value)
  }
}
