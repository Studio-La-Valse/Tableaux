import type { ColorARGB } from '@/geometry/color'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { isValidHexColor, toColorARGB } from '@/geometry/color-hex'
import { GraphNode } from '../../../core/graph-node'
import { GraphNodeType } from '../../decorators'

@GraphNodeType('Geometry', 'Color', 'Hex To Color')
export class HexToColor extends GraphNode {
  private input1
  private output

  constructor(modelId: string) {
    super(modelId)

    this.input1 = this.registerStringInput('Hex')
    this.output = this.registerObjectOutput<ColorARGB>('Color')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [hex] of inputIterators.cycleValues(this.input1)) {
      if (!isValidHexColor(hex))
        throw new Error('Excpected valid hex format.')
      this.output.next(toColorARGB(hex))
    }
  }
}
