import { GraphNode } from '../../core/graph-node'
import { inputIterators } from '../../core/input-iterators'
import { GraphNodeType } from '../decorators'
import { assertIsXY } from '@/geometry/xy'
import { createEllipse, type Ellipse as ellipse } from '@/geometry/ellipse'

@GraphNodeType('Geometry', 'Ellipse')
export class Ellipse extends GraphNode {
  private input1
  private input2
  private input3
  private output

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input1 = this.registerObjectInput('XY')
    this.input2 = this.registerNumberInput('Radius X')
    this.input3 = this.registerNumberInput('Radius Y')

    this.output = this.registerObjectOutput<ellipse>('Circle')
  }

  protected async solve(): Promise<void> {
    inputIterators.cycleValues(this.input1, this.input2, this.input3).forEach(([_xy, x, y]) => {
      const xy = assertIsXY(_xy)

      const ellipse = createEllipse(xy, { x, y })
      this.output.next(ellipse)
    })
  }
}
