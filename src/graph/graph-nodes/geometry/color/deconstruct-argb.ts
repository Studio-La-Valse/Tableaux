import { assertIsColorARGB } from '@/geometry/color-rgb'
import { GraphNode } from '../../../core/graph-node'
import { GraphNodeType } from '../../decorators'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'

@GraphNodeType('Geometry', 'Color', 'Deconstruct ARGB')
export class DeconstructARGB extends GraphNode {
  private input
  private output1
  private output2
  private output3
  private output4

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input = this.registerObjectInput('Color').validate(assertIsColorARGB)
    this.output1 = this.registerNumberOutput('Alpha')
    this.output2 = this.registerNumberOutput('Red')
    this.output3 = this.registerNumberOutput('Green')
    this.output4 = this.registerNumberOutput('Blue')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [argb] of inputIterators.cycleValues(this.input)) {
      this.output1.next(argb.a)
      this.output2.next(argb.r)
      this.output3.next(argb.g)
      this.output4.next(argb.b)
    }
  }
}
