import type { ColorARGB } from '@/geometry/color'
import { GraphNode } from '../../../core/graph-node'
import { inputIterators } from '../../../core/input-iterators'
import { GraphNodeType } from '../../decorators'
import { isValidHexColor, toColorARGB } from '@/geometry/color-hex'

@GraphNodeType('Geometry', 'Color', 'Hex To Color')
export class HexToColor extends GraphNode {
  private input1
  private output

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input1 = this.registerStringInput('Hex')
    this.output = this.registerObjectOutput<ColorARGB>('Color')
  }

  protected solve(): void {
    inputIterators
      .cycleValues(this.input1)
      .map(([hex]) => {
        if (!isValidHexColor(hex)) throw new Error('Excpected valid hex format.')
        return toColorARGB(hex)
      })
      .forEach((v) => this.output.next(v))
  }
}
