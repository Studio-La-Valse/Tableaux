import { GraphNode } from '../../core/graph-node'
import { inputIterators } from '../../core/input-iterators'

export class XY extends GraphNode {
  private input1
  private input2
  private output

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input1 = this.registerNumberInput('X')
    this.input2 = this.registerNumberInput('Y')
    this.output = this.registerObjectOutput('XY')
  }

  protected solve(): void {
    inputIterators
      .cycleValues(this.input1, this.input2)
      .map(([x, y]) => ({ x, y }))
      .forEach((v) => this.output.next(v))
  }
}
