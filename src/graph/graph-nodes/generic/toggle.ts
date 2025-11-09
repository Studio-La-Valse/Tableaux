import type { EmitterKind } from '@/graph/core/emitter'
import TogglePanel from '@/components/graph/Panels/TogglePanel.vue'
import { Emitter } from '@/graph/core/emitter'
import { GraphNodePanel, GraphNodeType } from '../decorators'

@GraphNodeType('Generic', 'Toggle')
@GraphNodePanel(TogglePanel)
export class Toggle extends Emitter<boolean> {
  private output

  override type: EmitterKind = 'toggle'

  constructor(modelId: string) {
    super(modelId, false)

    this.output = this.registerBooleanOutput('Value')
  }

  protected async solve(): Promise<void> {
    this.output.next(this.data.value)
  }
}
