import { GraphNode } from '../../core/graph-node'
import { inputIterators } from '../../core/input-iterators'
import { GraphNodeType } from '../decorators'
import { type XY } from '@/models/geometry/xy'
import { createEllipse, type Ellipse as ellipse } from '@/models/geometry/ellipse'

@GraphNodeType('Geometry', 'Ellipse')
export class Ellipse extends GraphNode {
  private input1
  private input2
  private input3
  private output

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input1 = this.registerObjectInput<XY>('XY')
    this.input2 = this.registerNumberInput('Radius X')
    this.input3 = this.registerNumberInput('Radius Y')

    this.output = this.registerObjectOutput<ellipse>('Circle')
  }

  protected solve(): void {
    inputIterators.cycleValues(this.input1, this.input2, this.input3).forEach(([xy, x, y]) => {
      const ellipse = createEllipse(xy, { x, y })
      this.output.next(ellipse)
    })
  }
}
