import { inputIterators } from '@/graph/core/input-iterators'
import { GraphNode } from '../../../core/graph-node'
import { GraphNodeType } from '../../decorators'

@GraphNodeType('Math', 'Trigonometry', 'Hypotenuse')
export class Hypotenuse extends GraphNode {
  private inputA
  private inputB
  private output

  constructor(id: string, path: string[]) {
    super(id, path)

    this.inputA = this.registerNumberInput('Side A')
    this.inputB = this.registerNumberInput('Side B')
    this.output = this.registerNumberOutput('Hypotenuse')
  }

  protected async solve(): Promise<void> {
    inputIterators
      .cycleValues(this.inputA, this.inputB)
      .map(([a, b]) => Math.sqrt(a * a + b * b))
      .forEach((result) => this.output.next(result))
  }
}
