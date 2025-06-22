import { GraphNode } from '../../core/graph-node'

export class TrimLongest extends GraphNode {
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
    const shortestLength = Math.min(this.input1.payloadLength, this.input2.payloadLength)
    for (let index = 0; index < shortestLength; index++) {
      this.output1.next(this.input1.payload[index])
      this.output2.next(this.input2.payload[index])
    }
  }
}
