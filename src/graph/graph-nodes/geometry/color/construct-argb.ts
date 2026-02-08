import type { ColorRGB } from '@/geometry/color/color-rgb'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { clamp } from '@/geometry/color/alpha'
import { GraphNode } from '../../../core/graph-node'
import { GraphNodeType } from '../../decorators'

@GraphNodeType('Geometry', 'Color', 'Construct ARGB')
export class ConstructARGB extends GraphNode {
  private input1
  private input2
  private input3
  private input4
  private output

  constructor(modelId: string) {
    super(modelId)

    this.input1 = this.registerNumberInput('Alpha')
    this.input2 = this.registerNumberInput('Red')
    this.input3 = this.registerNumberInput('Green')
    this.input4 = this.registerNumberInput('Blue')
    this.output = this.registerObjectOutput<ColorRGB>('Color')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [a, r, g, b] of inputIterators.cycleValues(
      this.input1,
      this.input2,
      this.input3,
      this.input4,
    )) {
      const res = { a: clamp(a), r, g, b }
      this.output.next(res)
    }
  }
}
