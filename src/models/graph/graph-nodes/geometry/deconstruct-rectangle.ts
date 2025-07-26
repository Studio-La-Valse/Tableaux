import { GraphNode } from '../../core/graph-node'
import { inputIterators } from '../../core/input-iterators'
import { GraphNodeType } from '../decorators'
import { type XY as xy } from '@/models/geometry/xy'
import {
  getBottomRight,
  getCenter,
  getHeight,
  getTopLeft,
  getWidth,
  type Rectangle as rect,
} from '@/models/geometry/rectangle'

@GraphNodeType('Geometry', 'Deconstruct Rectangle')
export class DeconstructRectangle extends GraphNode {
  private inputRect

  private outputTopLeft
  private outputBottomRight
  private outputCenter
  private outputWidth
  private outputHeight
  private outputArea
  private outputPerimeter

  constructor(id: string, path: string[]) {
    super(id, path)

    this.inputRect = this.registerObjectInput<rect>('Rectangle')

    this.outputTopLeft = this.registerObjectOutput<xy>('TopLeft')
    this.outputBottomRight = this.registerObjectOutput<xy>('BottomRight')
    this.outputCenter = this.registerObjectOutput<xy>('Center')

    this.outputWidth = this.registerNumberOutput('Width')
    this.outputHeight = this.registerNumberOutput('Height')

    this.outputArea = this.registerNumberOutput('Area')
    this.outputPerimeter = this.registerNumberOutput('Perimeter')
  }

  protected solve(): void {
    inputIterators.cycleValues(this.inputRect).forEach(([rect]) => {
      const topLeft = getTopLeft(rect)
      const width = getWidth(rect)
      const height = getHeight(rect)
      const bottomRight = getBottomRight(rect)
      const center = getCenter(rect)

      const area = width * height
      const perimeter = 2 * (width + height)

      this.outputTopLeft.next(topLeft)
      this.outputBottomRight.next(bottomRight)
      this.outputCenter.next(center)
      this.outputWidth.next(width)
      this.outputHeight.next(height)
      this.outputArea.next(area)
      this.outputPerimeter.next(perimeter)
    })
  }
}
