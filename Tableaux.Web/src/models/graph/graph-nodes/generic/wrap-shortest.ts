import { GraphNode } from '../../core/graph-node'
import { inputIterators } from '../../core/input-iterators'

export class WrapShortest extends GraphNode {
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
    inputIterators.cycleMultiples(this.input1, this.input2).forEach(([x, y]) => {
      this.output1.next(x)
      this.output2.next(y)
    })
  }
}
