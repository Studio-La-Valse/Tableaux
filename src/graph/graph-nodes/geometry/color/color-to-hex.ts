import { GraphNode } from '../../../core/graph-node'
import { inputIterators } from '../../../core/input-iterators'
import { GraphNodeType } from '../../decorators'
import { assertIsColorARGB, toColorHex } from '@/geometry/color-rgb'

@GraphNodeType('Geometry', 'Color', 'Color To Hex')
export class ColorToHex extends GraphNode {
  private input
  private output1

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input = this.registerObjectInput('Color')
    this.output1 = this.registerStringOutput('Hex Value')
  }

  protected async solve(): Promise<void> {
    inputIterators.cycleValues(this.input).forEach(([_argb]) => {
      const argb = assertIsColorARGB(_argb)
      const hex = toColorHex(argb)
      this.output1.next(hex)
    })
  }
}
