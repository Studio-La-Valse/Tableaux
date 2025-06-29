import { GraphNode } from '../../core/graph-node'
import { inputIterators } from '../../core/input-iterators'

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
    inputIterators.cycleMultiples(this.input1, this.input2)
      .map(([first, second]) => first / second)
      .forEach((v) => this.output.next(v))
  }
}
