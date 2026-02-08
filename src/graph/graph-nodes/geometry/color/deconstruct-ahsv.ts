import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { hsvOps } from '@/geometry/color/color-hsv-ops'
import { rgbOps } from '@/geometry/color/color-rgb-ops'
import { GraphNode } from '../../../core/graph-node'
import { GraphNodeType } from '../../decorators'

@GraphNodeType('Geometry', 'Color', 'Deconstruct AHSV')
export class DeconstructAHSV extends GraphNode {
  private input
  private output1
  private output2
  private output3
  private output4

  constructor(modelId: string) {
    super(modelId)

    this.input = this.registerObjectInput('Color').validate(rgbOps.cast)

    this.output1 = this.registerNumberOutput('Alpha')
    this.output2 = this.registerNumberOutput('Hue')
    this.output3 = this.registerNumberOutput('Saturation')
    this.output4 = this.registerNumberOutput('Brightness')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [argb] of inputIterators.cycleValues(this.input)) {
      const hsv = rgbOps.convert.hsv(argb)
      this.output1.next(hsvOps.extractAlpha(hsv))
      this.output2.next(hsv.h)
      this.output3.next(hsv.s)
      this.output4.next(hsv.v)
    }
  }
}
