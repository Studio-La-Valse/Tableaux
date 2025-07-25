import { GraphNode } from '../../../core/graph-node'
import { inputIterators } from '../../../core/input-iterators'
import { GraphNodeType } from '../../decorators'
import type { ColorARGB } from '@/models/geometry/color'
import { toColorHex } from '@/models/geometry/color-rgb'

@GraphNodeType('Geometry', 'Color', 'Color To Hex')
export class ColorToHex extends GraphNode {
  private input
  private output1

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input = this.registerObjectInput<ColorARGB>('Color')
    this.output1 = this.registerStringOutput("Hex Value")
  }

  protected solve(): void {
    inputIterators.cycleValues(this.input).forEach(([argb]) => {
      const hex = toColorHex(argb)
      this.output1.next(hex)
    })
  }
}
