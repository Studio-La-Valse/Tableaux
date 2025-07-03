import { GraphNode } from '../../core/graph-node'
import { inputIterators } from '../../core/input-iterators'

export class TrimLongest extends GraphNode {
  private input1
  private input2
  private output1
  private output2

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input1 = this.registerUnkownInput("First")
    this.input2 = this.registerUnkownInput("Second")

    this.output1 = this.registerUnkownOutput("First")
    this.output2 = this.registerUnkownOutput("Second")
  }

  protected solve(): void {
    inputIterators.zipToShortest(this.input1, this.input2).forEach(([x, y]) => {
      this.output1.next(x)
      this.output2.next(y)
    })
  }
}
