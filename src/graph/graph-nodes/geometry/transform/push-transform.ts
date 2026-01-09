import type { Drawable } from '@/geometry/primitives/union/drawable/drawable'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { drawableOps } from '@/geometry/primitives/union/drawable/drawable-ops'
import { assertIsTransformationMatrix, compose, identity } from '@/geometry/transform/transformation-matrix'
import { GraphNode } from '@/graph/core/graph-node'
import { GraphNodeType } from '@/graph/graph-nodes/decorators'

@GraphNodeType('Geometry', 'Transform', 'Transform')
export class PushTransform extends GraphNode {
  private inputGeometry
  private inputTransform

  private outputGeometry

  constructor(modelId: string) {
    super(modelId)

    this.inputGeometry = this.registerObjectInput('Geometry').validate(drawableOps.cast)
    this.inputTransform = this.registerObjectInput('Transformation').validate(
      assertIsTransformationMatrix,
    )

    this.outputGeometry = this.registerObjectOutput<Drawable>('Translated Geometry')
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
