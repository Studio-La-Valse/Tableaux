import type { GraphNodeInputType } from '../../core/graph-node-input'
import { GraphNode } from '../../core/graph-node'
import { reactive } from 'vue'
import { GraphNodePanel, GraphNodeType } from '../decorators'
import LoggerPanel from '@/components/graph/Panels/LoggerPanel.vue'

@GraphNodeType('Generic', 'Logger')
@GraphNodePanel(LoggerPanel)
export class Logger extends GraphNode {
  private input: GraphNodeInputType<string>

  public readonly values = reactive<string[]>([])

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input = this.registerStringInput("Values")
  }

  public arm(): void {
    this.values.length = 0
    super.arm()
  }

  public solve(): void {
    this.values.length = 0
    this.input.payload.forEach((e) => this.values.push(e))
  }
}
