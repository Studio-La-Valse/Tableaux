import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
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

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [a, b] of inputIterators.cycleValues(this.inputA, this.inputB)) {
      const result = Math.sqrt(a * a + b * b)
      this.output.next(result)
    }
  }
}
