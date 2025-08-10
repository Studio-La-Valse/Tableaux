import { GraphNode } from '../../core/graph-node'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { GraphNodeType } from '../decorators'
import { assertIsXY } from '@/geometry/xy'
import { createCircle, type Circle as circle } from '@/geometry/circle'

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

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [_xy, radius] of inputIterators.cycleValues(this.input1, this.input2)) {
      const xy = assertIsXY(_xy)

      const circle = createCircle(xy, radius)
      this.outputCircle.next(circle)
    }
  }
}
