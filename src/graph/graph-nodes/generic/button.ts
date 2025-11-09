import type { EmitterKind } from '@/graph/core/emitter'
import ButtonPanel from '@/components/graph/Panels/ButtonPanel.vue'
import { Emitter } from '@/graph/core/emitter'
import { GraphNodePanel, GraphNodeType } from '../decorators'

@GraphNodeType('Generic', 'Button')
@GraphNodePanel(ButtonPanel)
export class Button extends Emitter<boolean> {
  private output

  override type: EmitterKind = 'button'

  constructor(modelId: string) {
    super(modelId, false)

    this.output = this.registerBooleanOutput('Value')
  }

  protected async solve(): Promise<void> {
    this.output.next(this.data.value)
  }
}
