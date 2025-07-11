import { GraphNode } from '../../core/graph-node'
import { inputIterators } from '../../core/input-iterators'

export class Multiply extends GraphNode {
  private input1
  private input2
  private output

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input1 = this.registerNumberInput("First")
    this.input2 = this.registerNumberInput("Second")
    this.output = this.registerNumberOutput("Result")
  }

  protected solve(): void {
    inputIterators.cycleValues(this.input1, this.input2).map(([left, right]) => left * right).forEach(v => this.output.next(v))
  }
}
