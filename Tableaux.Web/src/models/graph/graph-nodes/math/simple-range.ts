import { GraphNode } from '../../core/graph-node'
import { inputIterators } from '../../core/input-iterators'

export class SimpleRange extends GraphNode {
  private input
  private output

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input = this.registerNumberInput()
    this.output = this.registerNumberOutput()
  }

  protected solve(): void {
    const [stop] = inputIterators.singletonOnly(this.input)
    for (let index = 0; index < stop; index++) {
      this.output.next(index);
    }
  }
}
