import { GraphNode } from '../../core/graph-node'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { GraphNodeType } from '../decorators'
import { assertAreXY } from '@/geometry/xy'
import { type Parallelogram as parallelogram, createParallelogram } from '@/geometry/parallelogram'

@GraphNodeType('Geometry', 'Parallelogram')
export class Parallelogram extends GraphNode {
  private bottomLeft
  private topLeft
  private topRight
  private outputRect

  constructor(id: string, path: string[]) {
    super(id, path)

    this.bottomLeft = this.registerObjectInput('Bottom Left')
    this.topLeft = this.registerObjectInput('Top Left')
    this.topRight = this.registerObjectInput('Top Right')

    this.outputRect = this.registerObjectOutput<parallelogram>('Rectangle')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [_bottomLeft, _topLeft, _topRight] of inputIterators.cycleValues(
      this.bottomLeft,
      this.topLeft,
      this.topRight,
    )) {
      const [bottomLeft, topLeft, topRight] = assertAreXY(_bottomLeft, _topLeft, _topRight)
      const rectangle = createParallelogram(bottomLeft, topLeft, topRight)
      this.outputRect.next(rectangle)
    }
  }
}
