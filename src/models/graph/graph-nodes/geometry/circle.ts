import { GraphNode } from '../../core/graph-node'
import { inputIterators } from '../../core/input-iterators'
import { GraphNodeType } from '../decorators'
import { assertIsXY } from '@/models/geometry/xy'
import { createCircle, type Circle as circle } from '@/models/geometry/circle'

@GraphNodeType('Geometry', 'Circle')
export class Circle extends GraphNode {
  private input1
  private input2
  private outputCircle

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input1 = this.registerObjectInput('XY')
    this.input2 = this.registerNumberInput('Radius')

    this.outputCircle = this.registerObjectOutput<circle>('Circle')
  }

  protected solve(): void {
    inputIterators.cycleValues(this.input1, this.input2).forEach(([_xy, radius]) => {
      const xy = assertIsXY(_xy)

      const circle = createCircle(xy, radius)
      this.outputCircle.next(circle)
    })
  }
}
