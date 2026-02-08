import type { ColorRGB } from '@/geometry/color/color-rgb'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { clamp } from '@/geometry/color/alpha'
import { hslOps } from '@/geometry/color/color-hsl-ops'
import { GraphNode } from '../../../core/graph-node'
import { GraphNodeType } from '../../decorators'

@GraphNodeType('Geometry', 'Color', 'Construct AHSL')
export class ConstructAHSL extends GraphNode {
  private input1
  private input2
  private input3
  private input4
  private output

  constructor(modelId: string) {
    super(modelId)

    this.input1 = this.registerNumberInput('Alpha')
    this.input2 = this.registerNumberInput('Hue')
    this.input3 = this.registerNumberInput('Saturation')
    this.input4 = this.registerNumberInput('Luminance')
    this.output = this.registerObjectOutput<ColorRGB>('Color')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [a, h, s, l] of inputIterators.cycleValues(
      this.input1,
      this.input2,
      this.input3,
      this.input4,
    )) {
      const v = { ...hslOps.convert.rgb({ h, s, l }), a: clamp(a) }
      this.output.next(v)
    }
  }
}
