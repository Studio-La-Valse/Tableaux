import { GraphNode } from '../../core/graph-node'
import { inputIterators } from '../../core/input-iterators'

export class Filter extends GraphNode {
  private input1
  private input2
  private output

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input1 = this.registerUnkownInput()
    this.input2 = this.registerBooleanInput()
    this.output = this.registerUnkownOutput()
  }

  protected solve(): void {
    inputIterators
      .cycleValues(this.input1, this.input2)
      .filter(([, right]) => right)
      .map(([left]) => left)
      .forEach((v) => this.output.next(v))
  }
}
