import type { ClearRect } from '@/geometry/primitives/union/drawable/clear-rect'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { rectangleOps } from '@/geometry/primitives/rectangle-ops'
import { GraphNode } from '@/graph/core/graph-node'
import { GraphNodeType } from '../decorators'

@GraphNodeType('Geometry', 'Surface', 'Clear Rectangle')
export class Rectangle extends GraphNode {
  private inputRect
  private outputRect

  constructor(modelId: string) {
    super(modelId)

    this.inputRect = this.registerObjectInput('Rect').validate(rectangleOps.cast)
    this.outputRect = this.registerObjectOutput<ClearRect>('Rectangle')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const rect of inputIterators.createGenerator(this.inputRect)) {
      const clearRect: ClearRect = {
        ...rect,
        kind: 'clear-rect',
      }
      this.outputRect.next(clearRect)
    }
  }
}
