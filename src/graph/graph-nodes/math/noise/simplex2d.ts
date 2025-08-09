import { GraphNode } from '@/graph/core/graph-node'
import { inputIterators } from '@/graph/core/input-iterators'
import Perlin from '@/noise/perlin'
import { GraphNodeType } from '../../decorators'

@GraphNodeType('Math', 'Noise', 'Simplex 2d')
export class Simplex2d extends GraphNode {
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

  protected async solve(): Promise<void> {
    inputIterators
      .cycleValues(this.input1, this.input2, this.inputScale)
      .map(([x, y, scale]) => this.perlin.simplex2(x / scale, y / scale))
      .forEach((v) => this.output.next(v))
  }
}
