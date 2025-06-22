import { GraphNode } from '../../core/graph-node'

export class RepeatUntil extends GraphNode {
  private input1
  private input2
  private output

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input1 = this.registerUnkownInput()
    this.input2 = this.registerNumberInput()
    this.output = this.registerUnkownOutput()
  }

  protected solve(): void {
    const signalLength = this.input1.payloadLength

    if (this.input2.payloadLength != 1) {
      throw new Error('Expected payload for input 2 to have one value.')
    }
    const targetLength = this.input2.payload[0]

    for (let index = 0; index < targetLength; index++) {
      const element = this.input1.payload[index % signalLength]
      this.output.next(element)
    }
  }
}
