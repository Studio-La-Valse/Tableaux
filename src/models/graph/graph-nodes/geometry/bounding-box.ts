import { GraphNode } from '../../core/graph-node'
import { inputIterators } from '../../core/input-iterators'
import { GraphNodeType } from '../decorators'
import { type Geometry } from '@/models/geometry/geometry'
import { getAxisAlignedBoundingBox, type AxisAlignedBoundingBox } from '@/models/geometry/axis-aligned-bounding-box'

@GraphNodeType('Geometry', 'BoundingBox')
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
