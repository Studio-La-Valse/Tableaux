import type { Rectangle as rect } from '@/geometry/primitives/rectangle'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { assertIsXY } from '@/geometry/primitives/xy'
import { GraphNode } from '@/graph/core/graph-node'
import { GraphNodeType } from '../../decorators'

@GraphNodeType('Geometry', 'Surface', 'Construct Rectangle')
export class Rectangle extends GraphNode {
  private inputTopLeft
  private inputWidth
  private inputHeight
  private outputRect

  constructor(modelId: string) {
    super(modelId)

    this.inputTopLeft = this.registerObjectInput('TopLeft').validate(assertIsXY)
    this.inputWidth = this.registerNumberInput('Width')
    this.inputHeight = this.registerNumberInput('Height')

    this.outputRect = this.registerObjectOutput<rect>('Rectangle')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [topLeft, width, height] of inputIterators.cycleValues(
      this.inputTopLeft,
      this.inputWidth,
      this.inputHeight,
    )) {
      const rectangle = { x: topLeft.x, y: topLeft.y, width, height }
      this.outputRect.next(rectangle)
    }
  }
}
