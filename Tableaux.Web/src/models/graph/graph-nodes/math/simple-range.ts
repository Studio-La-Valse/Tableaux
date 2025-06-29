import { GraphNode } from '../../core/graph-node'

export class SimpleRange extends GraphNode {
  private input
  private output

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input = this.registerNumberInput()
    this.output = this.registerNumberOutput()
  }

  protected solve(): void {
    const [stop] = this.cycleInputsSingleton(this.input)
    for (let index = 0; index < stop; index++) {
      this.output.next(index);
    }
  }
}
