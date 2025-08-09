import { GraphNode } from '@/graph/core/graph-node'
import { inputIterators } from '@/graph/core/input-iterators'
import { GraphNodeType } from '@/graph/graph-nodes/decorators'
import {
  getAxisAlignedBoundingBox,
  type AxisAlignedBoundingBox,
} from '@/geometry/axis-aligned-bounding-box'
import { isCurveLike } from '@/geometry/curve-like'
import { isSurfaceLike } from '@/geometry/surface-like'

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
    inputIterators.cycleValues(this.inputGeometry).forEach(([geom]) => {
      const valid = isSurfaceLike(geom) || isCurveLike(geom)
      if (!valid) {
        throw new Error('Provided geometry is not surface like or curve like')
      }

      const aabb = getAxisAlignedBoundingBox(geom)
      this.outputBox.next(aabb)
    })
  }
}
