import type { EmitterKind } from '@/graph/core/emitter'
import SliderPanel from '@/components/graph/Panels/SliderPanel.vue'
import { Emitter } from '@/graph/core/emitter'
import { GraphNodePanel, GraphNodeType } from '../decorators'

@GraphNodeType('Math', 'Slider')
@GraphNodePanel(SliderPanel)
export class Slider extends Emitter<number> {
  public type: EmitterKind = 'range'

  private output

  constructor(modelId: string) {
    super(modelId, 0)

    this.output = this.registerNumberOutput('Value')
  }

  protected async solve(): Promise<void> {
    this.output.next(this.data.value)
  }
}
