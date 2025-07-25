import { GraphNode } from '../../core/graph-node'
import { inputIterators } from '../../core/input-iterators'
import { GraphNodeType } from '../decorators'
import { type XY as xy } from '@/models/geometry/xy'
import { type Rectangle as rect } from '@/models/geometry/rectangle'

@GraphNodeType('Geometry', 'Rectangle')
export class Rectangle extends GraphNode {
  private inputTopLeft
  private inputWidth
  private inputHeight
  private outputRect

  constructor(id: string, path: string[]) {
    super(id, path)

    this.inputTopLeft = this.registerObjectInput<xy>('TopLeft')
    this.inputWidth = this.registerNumberInput('Width')
    this.inputHeight = this.registerNumberInput('Height')

    this.outputRect = this.registerObjectOutput<rect>('Rectangle')
  }

  protected solve(): void {
    inputIterators
      .cycleValues(this.inputTopLeft, this.inputWidth, this.inputHeight)
      .forEach(([topLeft, width, height]) => {
        this.outputRect.next({ topLeft, width, height })
      })
  }
}
