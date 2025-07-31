import { GraphNode } from '../../core/graph-node'
import { inputIterators } from '../../core/input-iterators'
import { GraphNodeType } from '../decorators'
import { type XY as xy } from '@/models/geometry/xy'
import {
  type Parallelogram as parallelogram,
  createParallelogram,
} from '@/models/geometry/parallelogram'

@GraphNodeType('Geometry', 'Parallelogram')
export class Parallelogram extends GraphNode {
  private bottomLeft
  private topLeft
  private topRight
  private outputRect

  constructor(id: string, path: string[]) {
    super(id, path)

    this.bottomLeft = this.registerObjectInput<xy>('Bottom Left')
    this.topLeft = this.registerObjectInput<xy>('Top Left')
    this.topRight = this.registerObjectInput<xy>('Top Right')

    this.outputRect = this.registerObjectOutput<parallelogram>('Rectangle')
  }

  protected solve(): void {
    inputIterators
      .cycleValues(this.bottomLeft, this.topLeft, this.topRight)
      .forEach(([topLeft, width, height]) => {
        const rectangle = createParallelogram(topLeft, width, height)
        this.outputRect.next(rectangle)
      })
  }
}
