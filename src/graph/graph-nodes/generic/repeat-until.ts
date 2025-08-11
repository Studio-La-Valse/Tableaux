import { GraphNode } from '../../core/graph-node'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { GraphNodeType } from '../decorators'

@GraphNodeType('Generic', 'Repeat Until')
export class RepeatUntil extends GraphNode {
  private input1
  private input2
  private output

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input1 = this.registerUnkownInput('Values')
    this.input2 = this.registerNumberInput('Count')
    this.output = this.registerUnkownOutput('Values')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    const signalLength = this.input1.payloadLength

    const [targetLength] = inputIterators.singletonOnly(this.input2)

    for await (const index of inputIterators.createRange(0, targetLength, 1)) {
      const element = this.input1.peek(index % signalLength)
      this.output.next(element)
    }
  }
}
