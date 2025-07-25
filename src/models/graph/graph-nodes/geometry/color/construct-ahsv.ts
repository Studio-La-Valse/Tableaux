import type { ColorARGB } from '@/models/geometry/color'
import { GraphNode } from '../../../core/graph-node'
import { inputIterators } from '../../../core/input-iterators'
import { GraphNodeType } from '../../decorators'
import { toColorRGB } from '@/models/geometry/color-hsv'

@GraphNodeType('Geometry', 'Color', 'Construct AHSV')
export class ConstructAHSV extends GraphNode {
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
    this.input4 = this.registerNumberInput('Brightness')
    this.output = this.registerObjectOutput<ColorARGB>('Color')
  }

  protected solve(): void {
    inputIterators
      .cycleValues(this.input1, this.input2, this.input3, this.input4)
      .map(([a, h, s, v]) => ({ a, h, s, v }))
      .map(({ a, h, s, v }) => ({ a, ...toColorRGB({ h, s, v }) }))
      .forEach((v) => this.output.next(v))
  }
}
