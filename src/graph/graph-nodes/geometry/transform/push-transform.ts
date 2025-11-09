import type { Shape } from '@/geometry/shape'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { asShape } from '@/geometry/shape'
import { assertIsTransformationMatrix, compose, identity } from '@/geometry/transformation-matrix'
import { GraphNode } from '@/graph/core/graph-node'
import { GraphNodeType } from '@/graph/graph-nodes/decorators'

@GraphNodeType('Geometry', 'Transform', 'Transform')
export class PushTransform extends GraphNode {
  private inputGeometry
  private inputTransform

  private outputGeometry

  constructor(modelId: string) {
    super(modelId)

    this.inputGeometry = this.registerObjectInput('Geometry').validate(asShape)
    this.inputTransform = this.registerObjectInput('Transformation').validate(
      assertIsTransformationMatrix,
    )

    this.outputGeometry = this.registerObjectOutput<Shape>('Translated Geometry')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [geom, transform] of inputIterators.cycleValues(
      this.inputGeometry,
      this.inputTransform,
    )) {
      const baseTransform = geom.t ?? identity()
      const result = compose(baseTransform, transform)
      const transformed = {
        ...geom,
        t: result,
      }
      this.outputGeometry.next(transformed)
    }
  }
}
