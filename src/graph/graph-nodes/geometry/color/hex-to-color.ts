import type { ColorRGB } from '@/geometry/color/color-rgb'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { hexOps } from '@/geometry/color/color-hex-ops'
import { GraphNode } from '../../../core/graph-node'
import { GraphNodeType } from '../../decorators'

@GraphNodeType('Geometry', 'Color', 'Hex To Color')
export class HexToColor extends GraphNode {
  private input1
  private output

  constructor(modelId: string) {
    super(modelId)

    this.input1 = this.registerStringInput('Hex')
    this.output = this.registerObjectOutput<ColorRGB>('Color')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [hex] of inputIterators.cycleValues(this.input1)) {
      const _hex = hexOps.cast(hex)
      this.output.next(hexOps.convert.rgb(_hex))
    }
  }
}
