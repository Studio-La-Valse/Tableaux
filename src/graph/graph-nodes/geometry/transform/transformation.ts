import { GraphNode } from '@/graph/core/graph-node'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { GraphNodeType } from '@/graph/graph-nodes/decorators'
import { assertIsShape } from '@/geometry/shape'
import type { TransformationMatrix } from '@/geometry/transformation-matrix'

@GraphNodeType('Geometry', 'Transform', 'Transformation')
export class Transformation extends GraphNode {
  private inputGeometry

  private outputGeometry

  constructor(id: string, path: string[]) {
    super(id, path)

    this.inputGeometry = this.registerObjectInput('Geometry')

    this.outputGeometry = this.registerObjectOutput<TransformationMatrix>('Translated Geometry')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [_geom] of inputIterators.cycleValues(this.inputGeometry)) {
      const geom = assertIsShape(_geom)
      this.outputGeometry.next(geom.transformation)
    }
  }
}
