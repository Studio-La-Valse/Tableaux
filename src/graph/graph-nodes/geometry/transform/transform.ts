import { GraphNode } from '@/graph/core/graph-node'
import { inputIterators } from '@/graph/core/input-iterators'
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

    this.inputGeometry = this.registerObjectInput('Geometry')
    this.inputTransform = this.registerObjectInput('Transformation')

    this.outputGeometry = this.registerObjectOutput<Geometry>('Translated Geometry')
  }

  protected async solve(): Promise<void> {
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
