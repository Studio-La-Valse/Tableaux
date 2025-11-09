import type { TransformationMatrix } from '@/geometry/transformation-matrix'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import {
  assertIsTransformationMatrix,
  invert,

} from '@/geometry/transformation-matrix'
import { GraphNode } from '@/graph/core/graph-node'
import { GraphNodeType } from '@/graph/graph-nodes/decorators'

@GraphNodeType('Geometry', 'Transform', 'Invert')
export class Invert extends GraphNode {
  private inputTransform
  private outputTransform

  constructor(modelId: string) {
    super(modelId)

    this.inputTransform = this.registerObjectInput('Transformation').validate(
      assertIsTransformationMatrix,
    )
    this.outputTransform = this.registerObjectOutput<TransformationMatrix>('Inverted Matrix')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [matrix2d] of inputIterators.cycleValues(this.inputTransform)) {
      const inverted = invert(matrix2d)
      this.outputTransform.next(inverted)
    }
  }
}
