import { GraphNode } from '../../core/graph-node'
import { inputIterators } from '../../core/input-iterators'
import { GraphNodeType } from '../decorators'

@GraphNodeType('Math', 'Divide')
export class Divide extends GraphNode {
  private input1
  private input2
  private output

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input1 = this.registerNumberInput("Values")
    this.input2 = this.registerNumberInput("Factor")
    this.output = this.registerNumberOutput("Result")
  }

  protected solve(): void {
    inputIterators
      .cycleValues(this.input1, this.input2)
      .map(([a, b]) => {
        if (b === 0) throw new Error('Division by zero')
        return a / b
      })
      .forEach((result) => this.output.next(result))
  }
}
