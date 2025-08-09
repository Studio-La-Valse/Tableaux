import TogglePanel from '@/components/graph/Panels/TogglePanel.vue'
import { GraphNode } from '../../core/graph-node'
import { GraphNodePanel, GraphNodeType } from '../decorators'

@GraphNodeType('Generic', 'Toggle')
@GraphNodePanel(TogglePanel)
export class Toggle extends GraphNode {
  private output

  public override data: { value: boolean } = { value: false }

  constructor(id: string, path: string[]) {
    super(id, path)

    this.output = this.registerBooleanOutput('Value')
  }

  public onChange(newValue: boolean): void {
    if (newValue === this.data.value) return

    this.arm()
    this.data.value = newValue
    this.complete()
  }

  protected async solve(): Promise<void> {
    this.output.next(this.data.value)
  }
}
