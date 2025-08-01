import type { JsonValue } from '@/graph/core/models/json-value'
import { GraphNode } from '../../core/graph-node'
import { inputIterators } from '../../core/input-iterators'
import { GraphNodeType } from '../decorators'

@GraphNodeType('Generic', 'Buffer')
export class Buffer extends GraphNode {
  private inputValues
  private inputLength
  private output

  public override data: { buffer: JsonValue[] } = { buffer: [] }

  constructor(id: string, path: string[]) {
    super(id, path)

    this.inputValues = this.registerUnkownInput('Input')
    this.inputLength = this.registerNumberInput('Length')
    this.output = this.registerUnkownOutput('Values')
  }

  protected solve(): void {
    const [length] = inputIterators.singletonOnly(this.inputLength)

    for (const v of this.inputValues.payload) {
      this.data.buffer.push(v)
    }

    while (this.data.buffer.length && this.data.buffer.length > length) {
      this.data.buffer.shift()
    }

    for (const v of this.data.buffer) {
      this.output.next(v)
    }
  }
}
