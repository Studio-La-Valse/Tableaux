import { GraphNode } from '../../core/graph-node'

export class RepeatShortest extends GraphNode {
  private input1
  private input2
  private output1
  private output2

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input1 = this.registerUnkownInput()
    this.input2 = this.registerUnkownInput()

    this.output1 = this.registerUnkownOutput()
    this.output2 = this.registerUnkownOutput()
  }

  protected solve(): void {
    const longestLength = Math.max(this.input1.payloadLength, this.input2.payloadLength)
    for (let index = 0; index < longestLength; index++) {
      this.output1.next(this.input1.payload[Math.min(index, this.input1.payloadLength)])
      this.output2.next(this.input2.payload[Math.min(index, this.input2.payloadLength)])
    }
  }
}
