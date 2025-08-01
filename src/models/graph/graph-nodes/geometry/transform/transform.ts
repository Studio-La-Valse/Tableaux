import { GraphNode } from '@/models/graph/core/graph-node'
import { inputIterators } from '@/models/graph/core/input-iterators'
import { GraphNodeType } from '@/models/graph/graph-nodes/decorators'
import { assertIsGeometry, setTransform, type Geometry } from '@/models/geometry/geometry'
import { assertIsTransformationMatrix } from '@/models/geometry/transformation-matrix'

@GraphNodeType('Geometry', 'Transform', 'Transform')
export class Transform extends GraphNode {
  private inputGeometry
  private inputTransform

  private outputGeometry

  constructor(id: string, path: string[]) {
    super(id, path)

    this.inputGeometry = this.registerObjectInput('Geometry')
    this.inputTransform = this.registerObjectInput('Transformation')

    this.outputGeometry = this.registerObjectOutput<Geometry>('Translated Geometry')
  }

  protected solve(): void {
    inputIterators
      .cycleValues(this.inputGeometry, this.inputTransform)
      .forEach(([_geom, _transform]) => {
        const geom = assertIsGeometry(_geom)
        const matrix2d = assertIsTransformationMatrix(_transform)
        const transformed = setTransform(geom, matrix2d)
        this.outputGeometry.next(transformed)
      })
  }
}
