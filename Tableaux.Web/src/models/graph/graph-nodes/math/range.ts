import { GraphNode } from '../../core/graph-node'

export class Range extends GraphNode {
  private input1
  private input2
  private input3
  private output

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input1 = this.registerNumberInput()
    this.input2 = this.registerNumberInput()
    this.input3 = this.registerNumberInput()
    this.output = this.registerNumberOutput()
  }

  protected solve(): void {
    const start = this.input1.payload[0]
    const stop = this.input2.payload[0]
    const step = this.input3.payload[0]
    if (step <= 0) {
      const msg = `Invalid input, stepsize smaller or equal to 0`
      throw new Error(msg)
    }

    for (let index = start; index < stop; index += step) {
      this.output.next(index)
    }
  }
}
