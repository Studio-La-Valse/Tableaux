import { GraphNode } from '../../core/graph-node'
import { inputIterators } from '../../core/input-iterators'
import { GraphNodeType } from '../decorators'
import { type XY as xy } from '@/models/geometry/xy'
import { type Rectangle as rect, deconstruct } from '@/models/geometry/rectangle'

@GraphNodeType('Geometry', 'Deconstruct Rectangle')
export class DeconstructRectangle extends GraphNode {
  private inputRect

  private outputTopLeft
  private outputBottomRight
  private outputCenter
  private outputWidth
  private outputHeight
  private outputRotation
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

    this.outputRotation = this.registerNumberOutput('Rotation')
    this.outputArea = this.registerNumberOutput('Area')
    this.outputPerimeter = this.registerNumberOutput('Perimeter')
  }

  protected solve(): void {
    inputIterators.cycleValues(this.inputRect).forEach(([rect]) => {
      const { topLeft, bottomRight, center, width, height, rotation, area, perimeter } =
        deconstruct(rect)

      this.outputTopLeft.next(topLeft)
      this.outputBottomRight.next(bottomRight)
      this.outputCenter.next(center)
      this.outputWidth.next(width)
      this.outputHeight.next(height)
      this.outputRotation.next(rotation)
      this.outputArea.next(area)
      this.outputPerimeter.next(perimeter)
    })
  }
}
