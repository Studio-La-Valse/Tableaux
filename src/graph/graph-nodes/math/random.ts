import { GraphNode } from '@/graph/core/graph-node'
import { GraphNodeType } from '../decorators'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'

@GraphNodeType('Math', 'Random')
export class Random extends GraphNode {
  private numbers
  private output
  constructor(id: string, path: string[]) {
    super(id, path)
    this.numbers = this.registerNumberInput('Seed')
    this.output = this.registerNumberOutput('Random')
  }

  private splitmix32(seed: number) {
    return function () {
      seed |= 0
      seed = (seed + 0x9e3779b9) | 0
      let t = seed ^ (seed >>> 16)
      t = Math.imul(t, 0x21f0aaad)
      t = t ^ (t >>> 15)
      t = Math.imul(t, 0x735a2d97)
      return ((t = t ^ (t >>> 15)) >>> 0) / 4294967296
    }
  }

  protected override async solve(iterators: InputIteratorsAsync): Promise<void> {
    for await (const seed of iterators.createGenerator(this.numbers)) {
      const generator = this.splitmix32(seed)
      const number = generator()
      this.output.next(number)
    }
  }
}
