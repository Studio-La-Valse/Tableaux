import type { ColorARGB } from '@/models/geometry/color'
import { GraphNode } from '../../../core/graph-node'
import { inputIterators } from '../../../core/input-iterators'
import { GraphNodeType } from '../../decorators'
import { toColorHSL } from '@/models/geometry/color-rgb'

@GraphNodeType('Geometry', 'Color', 'Deconstruct AHSL')
export class DeconstructAHSL extends GraphNode {
  private input
  private output1
  private output2
  private output3
  private output4

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input = this.registerObjectInput<ColorARGB>('Color')
    this.output1 = this.registerNumberOutput('Alpha')
    this.output2 = this.registerNumberOutput('Hue')
    this.output3 = this.registerNumberOutput('Saturation')
    this.output4 = this.registerNumberOutput('Luminance')
  }

  protected solve(): void {
    inputIterators.cycleValues(this.input).forEach(([argb]) => {
      const hsl = toColorHSL(argb)
      this.output1.next(argb.a)
      this.output2.next(hsl.h)
      this.output3.next(hsl.s)
      this.output4.next(hsl.l)
    })
  }
}
