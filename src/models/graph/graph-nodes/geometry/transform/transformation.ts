import { GraphNode } from '@/models/graph/core/graph-node'
import { inputIterators } from '@/models/graph/core/input-iterators'
import { GraphNodeType } from '@/models/graph/graph-nodes/decorators'
import { assertIsShape } from '@/models/geometry/geometry'
import type { TransformationMatrix } from '@/models/geometry/transformation-matrix'

@GraphNodeType('Geometry', 'Transform', 'Transformation')
export class Transformation extends GraphNode {
  private inputGeometry

  private outputGeometry

  constructor(id: string, path: string[]) {
    super(id, path)

    this.inputGeometry = this.registerObjectInput('Geometry')

    this.outputGeometry = this.registerObjectOutput<TransformationMatrix>('Translated Geometry')
  }

  protected solve(): void {
    inputIterators.cycleValues(this.inputGeometry).forEach(([_geom]) => {
      const geom = assertIsShape(_geom)
      this.outputGeometry.next(geom.transformation)
    })
  }
}
