import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { splitmix32 } from '@/geometry/random'
import { GraphNode } from '@/graph/core/graph-node'
import { GraphNodeType } from '../decorators'

@GraphNodeType('Math', 'Random')
export class Random extends GraphNode {
  private numbers
  private output
  constructor(modelId: string) {
    super(modelId)
    this.numbers = this.registerNumberInput('Seed')
    this.output = this.registerNumberOutput('Random')
  }

  protected override async solve(iterators: InputIteratorsAsync): Promise<void> {
    for await (const seed of iterators.createGenerator(this.numbers)) {
      const generator = splitmix32(seed)
      const number = generator()
      this.output.next(number)
    }
  }
}
