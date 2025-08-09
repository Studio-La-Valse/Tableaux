import type { ColorARGB } from '@/geometry/color'
import { GraphNode } from '../../../core/graph-node'
import { inputIterators } from '../../../core/input-iterators'
import { GraphNodeType } from '../../decorators'
import { toColorRGB } from '@/geometry/color-hsl'

@GraphNodeType('Geometry', 'Color', 'Construct AHSL')
export class ConstructAHSL extends GraphNode {
  private input1
  private input2
  private input3
  private input4
  private output

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input1 = this.registerNumberInput('Alpha')
    this.input2 = this.registerNumberInput('Hue')
    this.input3 = this.registerNumberInput('Saturation')
    this.input4 = this.registerNumberInput('Luminance')
    this.output = this.registerObjectOutput<ColorARGB>('Color')
  }

  protected async solve(): Promise<void> {
    inputIterators
      .cycleValues(this.input1, this.input2, this.input3, this.input4)
      .map(([a, h, s, l]) => ({ a, h, s, l }))
      .map(({ a, h, s, l }) => ({ a, ...toColorRGB({ h, s, l }) }))
      .forEach((v) => this.output.next(v))
  }
}
