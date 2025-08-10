import { GraphNode } from '../../core/graph-node'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { GraphNodeType } from '../decorators'
import { assertIsXY } from '@/geometry/xy'
import { createRectangle, type Rectangle as rect } from '@/geometry/rectangle'

@GraphNodeType('Geometry', 'Rectangle')
export class Rectangle extends GraphNode {
  private inputTopLeft
  private inputWidth
  private inputHeight
  private outputRect

  constructor(id: string, path: string[]) {
    super(id, path)

    this.inputTopLeft = this.registerObjectInput('TopLeft')
    this.inputWidth = this.registerNumberInput('Width')
    this.inputHeight = this.registerNumberInput('Height')

    this.outputRect = this.registerObjectOutput<rect>('Rectangle')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [_topLeft, width, height] of inputIterators.cycleValues(
      this.inputTopLeft,
      this.inputWidth,
      this.inputHeight,
    )) {
      const topLeft = assertIsXY(_topLeft)
      const rectangle = createRectangle(topLeft, width, height)
      this.outputRect.next(rectangle)
    }
  }
}
