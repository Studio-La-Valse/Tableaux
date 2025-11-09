import type { GraphNodeOutputType } from '../../core/graph-node-output'
import TextPanel from '@/components/graph/Panels/TextPanel.vue'
import { Emitter } from '@/graph/core/emitter'
import { GraphNodePanel, GraphNodeType } from '../decorators'

@GraphNodeType('Text', 'Text Emitter')
@GraphNodePanel(TextPanel)
export class TextEmitter extends Emitter<string> {
  public override type: 'number' | 'text' = 'text'

  private output: GraphNodeOutputType<string>

  constructor(modelId: string) {
    super(modelId, 'Hello, world!')

    this.output = this.registerStringOutput('Text')
  }

  protected async solve(): Promise<void> {
    this.output.next(this.data.value)
  }
}
