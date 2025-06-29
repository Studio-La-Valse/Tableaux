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
    this.cycleInputsValues(this.input1, this.input2).map(([x, y]) => ({ x, y })).forEach(v => this.output.next(v))
  }
}
