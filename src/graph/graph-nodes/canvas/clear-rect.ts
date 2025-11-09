import type { ClearRectShape } from '@/geometry/clear-rect'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { asRectangle } from '@/geometry/rectangle'
import { GraphNode } from '@/graph/core/graph-node'
import { GraphNodeType } from '../decorators'

@GraphNodeType('Geometry', 'Surface', 'Clear Rectangle')
export class Rectangle extends GraphNode {
  private inputRect
  private outputRect

  constructor(modelId: string) {
    super(modelId)

    this.inputRect = this.registerObjectInput('Rect').validate(asRectangle)
    this.outputRect = this.registerObjectOutput<ClearRectShape>('Rectangle')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const rect of inputIterators.createGenerator(this.inputRect)) {
      const clearRect: ClearRectShape = {
        ...rect,
        kind: 'clear-rect',
      }
      this.outputRect.next(clearRect)
    }
  }
}
