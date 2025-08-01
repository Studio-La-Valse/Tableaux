import { GraphNode } from '@/graph/core/graph-node'
import { inputIterators } from '@/graph/core/input-iterators'
import { GraphNodeType } from '@/graph/graph-nodes/decorators'
import { assertIsShape } from '@/geometry/geometry'
import {
  getAxisAlignedBoundingBox,
  type AxisAlignedBoundingBox,
} from '@/geometry/axis-aligned-bounding-box'

@GraphNodeType('Geometry', 'Analyze', 'BoundingBox')
export class BoundingBox extends GraphNode {
  private inputGeometry
  private outputBox

  constructor(id: string, path: string[]) {
    super(id, path)

    this.inputGeometry = this.registerObjectInput('Geometry')
    this.outputBox = this.registerObjectOutput<AxisAlignedBoundingBox>('Bounding Box')
  }

  protected solve(): void {
    inputIterators.cycleValues(this.inputGeometry).forEach(([_geom]) => {
      const geom = assertIsShape(_geom)
      const aabb = getAxisAlignedBoundingBox(geom)
      this.outputBox.next(aabb)
    })
  }
}
