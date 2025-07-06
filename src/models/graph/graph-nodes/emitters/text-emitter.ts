import { GraphNode } from '../../core/graph-node'
import type { GraphNodeOutputType } from '../../core/graph-node-output'

export class TextEmitter extends GraphNode {
  private output: GraphNodeOutputType<string>

  constructor(id: string, path: string[]) {
    super(id, path)

    this.output = this.registerStringOutput('Text')
  }

  override onInitialize(): void {
    if (!this.data.value) this.data.value = 'Hello, world!'
    this.solve()
  }

  public onChange(newValue: string): void {
    this.arm()
    this.data.value = newValue
    this.complete()
  }

  protected solve(): void {
    const text = this.data.value as string
    this.output.next(text)
  }
}
