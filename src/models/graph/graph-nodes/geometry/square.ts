import { createSquare } from '@/models/geometry/square'
import { GraphNode } from '../../core/graph-node'
import { inputIterators } from '../../core/input-iterators'
import { GraphNodeType } from '../decorators'
import { type XY as xy } from '@/models/geometry/xy'
import { type Square as square } from '@/models/geometry/square'

@GraphNodeType('Geometry', 'Square')
export class Square extends GraphNode {
  private inputTopLeft
  private inputSize
  private outputSquare

  constructor(id: string, path: string[]) {
    super(id, path)

    this.inputTopLeft = this.registerObjectInput<xy>('TopLeft')
    this.inputSize = this.registerNumberInput('Size')

    this.outputSquare = this.registerObjectOutput<square>('Square')
  }

  protected solve(): void {
    inputIterators.cycleValues(this.inputTopLeft, this.inputSize).forEach(([topLeft, size]) => {
      const rectangle = createSquare(topLeft, size)
      this.outputSquare.next(rectangle)
    })
  }
}
