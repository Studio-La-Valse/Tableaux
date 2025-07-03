import { GraphNode } from '../../core/graph-node'
import { inputIterators } from '../../core/input-iterators'

export class CarthesianProduct extends GraphNode {
  private input1
  private input2
  private output1
  private output2

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input1 = this.registerUnkownInput("Left")
    this.input2 = this.registerUnkownInput("Right")

    this.output1 = this.registerUnkownOutput("Left")
    this.output2 = this.registerUnkownOutput("Right")
  }

  protected solve(): void {
    inputIterators.cartesianProduct(this.input1, this.input2).forEach(([x, y]) => {
      this.output1.next(x)
      this.output2.next(y)
    })
  }
}
