import { GraphNode } from '../../core/graph-node'
import { inputIterators } from '../../core/input-iterators'
import { GraphNodeType } from '../decorators'

@GraphNodeType('Generic', 'Repeat Until')
export class RepeatUntil extends GraphNode {
  private input1
  private input2
  private output

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input1 = this.registerUnkownInput("Values")
    this.input2 = this.registerNumberInput("Count")
    this.output = this.registerUnkownOutput("Values")
  }

  protected solve(): void {
    const signalLength = this.input1.payloadLength

    const [targetLength] = inputIterators.singletonOnly(this.input2)

    for (let index = 0; index < targetLength; index++) {
      const element = this.input1.payload[index % signalLength]
      this.output.next(element)
    }
  }
}
