import { GraphNode } from '@/graph/core/graph-node'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { GraphNodeType } from '@/graph/graph-nodes/decorators'
import { assertIsGeometry, setTransform, type Geometry } from '@/geometry/geometry'
import { assertIsTransformationMatrix } from '@/geometry/transformation-matrix'

@GraphNodeType('Geometry', 'Transform', 'Transform')
export class Transform extends GraphNode {
  private inputGeometry
  private inputTransform

  private outputGeometry

  constructor(id: string, path: string[]) {
    super(id, path)

    this.inputGeometry = this.registerObjectInput('Geometry').validate(assertIsGeometry)
    this.inputTransform = this.registerObjectInput('Transformation').validate(
      assertIsTransformationMatrix,
    )

    this.outputGeometry = this.registerObjectOutput<Geometry>('Translated Geometry')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [geom, transform] of inputIterators.cycleValues(
      this.inputGeometry,
      this.inputTransform,
    )) {
      const transformed = setTransform(geom, transform)
      this.outputGeometry.next(transformed)
    }
  }
}
