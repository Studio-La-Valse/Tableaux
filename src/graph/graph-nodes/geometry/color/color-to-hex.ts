import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { rgbOps } from '@/geometry/color/color-rgb-ops'
import { GraphNode } from '../../../core/graph-node'
import { GraphNodeType } from '../../decorators'

@GraphNodeType('Geometry', 'Color', 'Color To Hex')
export class ColorToHex extends GraphNode {
  private input
  private output1

  constructor(modelId: string) {
    super(modelId)

    this.input = this.registerObjectInput('Color').validate(rgbOps.cast)
    this.output1 = this.registerStringOutput('Hex Value')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [argb] of inputIterators.cycleValues(this.input)) {
      const hex = rgbOps.convert.hex(argb)
      this.output1.next(hex)
    }
  }
}
