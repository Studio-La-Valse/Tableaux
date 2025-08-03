import { GraphNode } from '../../core/graph-node'
import { GraphNodePanel, GraphNodeType } from '../decorators'
import ButtonPanel from '@/components/graph/Panels/ButtonPanel.vue'

@GraphNodeType('Generic', 'Button')
@GraphNodePanel(ButtonPanel)
export class Button extends GraphNode {
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

  protected solve(): void {
    this.output.next(this.data.value)
  }
}
