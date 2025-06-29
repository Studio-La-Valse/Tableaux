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
    this.cycleInputsValues(this.input1, this.input2).map(([first, second]) => first / second).forEach(this.output.next)
  }
}
