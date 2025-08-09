import { createSquare } from '@/geometry/square'
import { GraphNode } from '../../core/graph-node'
import { inputIterators } from '../../core/input-iterators'
import { GraphNodeType } from '../decorators'
import { type Square as square } from '@/geometry/square'
import { assertIsXY } from '@/geometry/xy'

@GraphNodeType('Geometry', 'Square')
export class Square extends GraphNode {
  private inputTopLeft
  private inputSize
  private outputSquare

  constructor(id: string, path: string[]) {
    super(id, path)

    this.inputTopLeft = this.registerObjectInput('TopLeft')
    this.inputSize = this.registerNumberInput('Size')

    this.outputSquare = this.registerObjectOutput<square>('Square')
  }

  protected async solve(): Promise<void> {
    inputIterators.cycleValues(this.inputTopLeft, this.inputSize).forEach(([_topLeft, size]) => {
      const topLeft = assertIsXY(_topLeft)
      const rectangle = createSquare(topLeft, size)
      this.outputSquare.next(rectangle)
    })
  }
}
