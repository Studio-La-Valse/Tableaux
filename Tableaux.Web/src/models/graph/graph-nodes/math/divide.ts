import { GraphNode } from '../../core/graph-node'

export class Divide extends GraphNode {
  private input1
  private input2
  private output

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input1 = this.registerNumberInput()
    this.input2 = this.registerNumberInput()
    this.output = this.registerNumberOutput()
  }

  protected solve(): void {
    const length = this.getEqualLength()
    for (let index = 0; index < length; index++) {
      const right = this.input2.payload[index]
      const element = right == 0 ? 0 : this.input1.payload[index] / right
      this.output.next(element)
    }
  }
}
