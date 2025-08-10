import { GraphNode } from '@/graph/core/graph-node'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import Perlin from '@/noise/perlin'
import { GraphNodeType } from '../../decorators'

@GraphNodeType('Math', 'Noise', 'Perlin 2d')
export class Perlin2d extends GraphNode {
  private input1
  private input2
  private inputScale

  private output

  private perlin

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input1 = this.registerNumberInput('X')
    this.input2 = this.registerNumberInput('Y')
    this.inputScale = this.registerNumberInput('Scale')
    this.output = this.registerNumberOutput('Value')
    this.perlin = new Perlin()
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [x, y, scale] of inputIterators.cycleValues(
      this.input1,
      this.input2,
      this.inputScale,
    )) {
      const v = this.perlin.perlin2(x / scale, y / scale)
      this.output.next(v)
    }
  }
}
