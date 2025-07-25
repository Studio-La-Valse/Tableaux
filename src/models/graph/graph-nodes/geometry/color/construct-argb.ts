import { GraphNode } from '../../../core/graph-node'
import { inputIterators } from '../../../core/input-iterators'
import { GraphNodeType } from '../../decorators'
import { type ColorARGB } from '@/models/geometry/color'

@GraphNodeType('Geometry', 'Color', 'Construct ARGB')
export class ConstructARGB extends GraphNode {
  private input1
  private input2
  private input3
  private input4
  private output

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input1 = this.registerNumberInput('Alpha')
    this.input2 = this.registerNumberInput('Red')
    this.input3 = this.registerNumberInput('Green')
    this.input4 = this.registerNumberInput('Blue')
    this.output = this.registerObjectOutput<ColorARGB>('Color')
  }

  protected solve(): void {
    inputIterators
      .cycleValues(this.input1, this.input2, this.input3, this.input4)
      .map(([a, r, g, b]) => ({ a, r, g, b }))
      .forEach((v) => this.output.next(v))
  }
}
