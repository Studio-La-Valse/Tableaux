import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { GraphNode } from '@/graph/core/graph-node'
import { GraphNodeType } from '../decorators'

@GraphNodeType('Math', 'Min-Max')
export class MinMax extends GraphNode {
  private numbers
  private largest
  private smallest

  constructor(modelId: string) {
    super(modelId)

    this.numbers = this.registerNumberInput('Numbers')
    this.smallest = this.registerNumberOutput('Smallest')
    this.largest = this.registerNumberOutput('Largest')
  }

  protected override async solve(iterators: InputIteratorsAsync): Promise<void> {
    let largest
    let smallest

    for await (const v of iterators.createGenerator(this.numbers)) {
      if (!largest || v > largest) {
        largest = v
      }

      if (!smallest || v < smallest) {
        smallest = v
      }
    }

    if (!largest || !smallest) {
      throw new Error('Sequence of numbers was empty')
    }

    this.smallest.next(smallest)
    this.largest.next(largest)
  }
}
