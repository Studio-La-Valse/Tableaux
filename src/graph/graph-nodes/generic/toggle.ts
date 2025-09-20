import TogglePanel from '@/components/graph/Panels/TogglePanel.vue'
import { GraphNodePanel, GraphNodeType } from '../decorators'
import { Emitter, type EmitterKind } from '@/graph/core/emitter'

@GraphNodeType('Generic', 'Toggle')
@GraphNodePanel(TogglePanel)
export class Toggle extends Emitter<boolean> {
  private output

  override type: EmitterKind = 'toggle'

  constructor(id: string, path: string[]) {
    super(id, path, false)

    this.output = this.registerBooleanOutput('Value')
  }

  protected async solve(): Promise<void> {
    this.output.next(this.data.value)
  }
}
