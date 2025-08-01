import { GraphNode } from '@/models/graph/core/graph-node'
import { inputIterators } from '@/models/graph/core/input-iterators'
import { GraphNodeType } from '@/models/graph/graph-nodes/decorators'
import { type Geometry } from '@/models/geometry/geometry'
import { getAxisAlignedBoundingBox, type AxisAlignedBoundingBox } from '@/models/geometry/axis-aligned-bounding-box'

@GraphNodeType('Geometry', 'Analyze', 'BoundingBox')
export class BoundingBox extends GraphNode {
  private inputGeometry
  private outputBox

  constructor(id: string, path: string[]) {
    super(id, path)

    this.inputGeometry = this.registerObjectInput<Geometry>('Geometry')
    this.outputBox = this.registerObjectOutput<AxisAlignedBoundingBox>('Bounding Box')
  }

  protected solve(): void {
    inputIterators.cycleValues(this.inputGeometry).forEach(([geom]) => {
      const aabb = getAxisAlignedBoundingBox(geom)
      this.outputBox.next(aabb)
    })
  }
}
