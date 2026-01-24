import type { TransformationMatrix } from '@/geometry/transform/transformation-matrix'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { xyOps } from '@/geometry/primitives/xy-ops'
import { createTranslation } from '@/geometry/transform/transformation-matrix'
import { GraphNode } from '@/graph/core/graph-node'
import { GraphNodeType } from '@/graph/graph-nodes/decorators'

@GraphNodeType('Geometry', 'Transform', 'Create Translation')
export class CreateTranslation extends GraphNode {
  private inputOffset

  private outputGeometry

  constructor(modelId: string) {
    super(modelId)

    this.inputOffset = this.registerObjectInput('Offset').validate(xyOps.cast)

    this.outputGeometry = this.registerObjectOutput<TransformationMatrix>('Transformation Matrix')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [xy] of inputIterators.cycleValues(this.inputOffset)) {
      const moved = createTranslation(xy)
      this.outputGeometry.next(moved)
    }
  }
}
