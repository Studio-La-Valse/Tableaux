import { GraphNode } from '../../core/graph-node'
import type { GraphNodeOutputType } from '../../core/graph-node-output'
import { GraphNodeType } from '../decorators'

@GraphNodeType('Text', 'Text Emitter')
export class TextEmitter extends GraphNode {
  private output: GraphNodeOutputType<string>

  public override data: { value: string } = { value: 'Hello, world!' }

  constructor(id: string, path: string[]) {
    super(id, path)

    this.output = this.registerStringOutput('Text')
  }

  public onChange(newValue: string): void {
    this.arm()
    this.data.value = newValue
    this.complete()
  }

  protected solve(): void {
    this.output.next(this.data.value)
  }
}
