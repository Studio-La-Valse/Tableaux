import type { XY } from '@/geometry/primitives/xy'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { xyOps } from '@/geometry/primitives/xy-ops'
import { assertIsTransformationMatrix } from '@/geometry/transform/transformation-matrix'
import { GraphNode } from '@/graph/core/graph-node'
import { GraphNodeType } from '@/graph/graph-nodes/decorators'

@GraphNodeType('Vector', 'Ops', 'Apply Transform')
class _ extends GraphNode {
  transform
  points
  outPoints

  protected async solve(iterators: InputIteratorsAsync): Promise<void> {
    for await (const [p, t] of iterators.cycleValues(this.points, this.transform)) {
      const result = xyOps.applyMatrix(p, t)
      this.outPoints.next(result)
    }
  }

  constructor(modelId: string) {
    super(modelId)

    this.points = this.registerObjectInput('Points').validate(xyOps.cast)
    this.transform = this.registerObjectInput('Transformations').validate(assertIsTransformationMatrix)
    this.outPoints = this.registerObjectOutput<XY>('Output Points')
  }
}
