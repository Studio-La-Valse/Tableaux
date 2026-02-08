import type { ColorRGB } from '@/geometry/color/color-rgb'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { clamp } from '@/geometry/color/alpha'
import { hsvOps } from '@/geometry/color/color-hsv-ops'
import { GraphNode } from '../../../core/graph-node'
import { GraphNodeType } from '../../decorators'

@GraphNodeType('Geometry', 'Color', 'Construct AHSV')
export class ConstructAHSV extends GraphNode {
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
    this.input4 = this.registerNumberInput('Brightness')
    this.output = this.registerObjectOutput<ColorRGB>('Color')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [a, h, s, v] of inputIterators.cycleValues(
      this.input1,
      this.input2,
      this.input3,
      this.input4,
    )) {
      const r = { ...hsvOps.convert.rgb({ h, s, v }), a: clamp(a) }
      this.output.next(r)
    }
  }
}
