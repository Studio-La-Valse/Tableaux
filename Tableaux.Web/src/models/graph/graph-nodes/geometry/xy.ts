import { GraphNode } from '../../core/graph-node'

export class XY extends GraphNode {
  private input1
  private input2
  private output

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input1 = this.registerNumberInput()
    this.input2 = this.registerNumberInput()
    this.output = this.registerObjectOutput()
  }

  protected solve(): void {
    const length = this.getEqualLength()

    for (let index = 0; index < length; index++) {
      const x = this.input1.payload[index]
      const y = this.input2.payload[index]
      const element = { x, y }
      this.output.next(element)
    }
  }
}
