import { assertIsXY } from '@/models/geometry/xy'
import { GraphNode } from '@/models/graph/core/graph-node'
import { inputIterators } from '@/models/graph/core/input-iterators'
import { GraphNodeType } from '@/models/graph/graph-nodes/decorators'
import { assertIsGeometry, translate, type Geometry } from '@/models/geometry/geometry'

@GraphNodeType('Geometry', 'Transform', 'Translate')
export class Translate extends GraphNode {
  private inputGeometry
  private inputOffset

  private outputGeometry

  constructor(id: string, path: string[]) {
    super(id, path)

    this.inputGeometry = this.registerObjectInput('Geometry')
    this.inputOffset = this.registerObjectInput('Offset')

    this.outputGeometry = this.registerObjectOutput<Geometry>('Translated Geometry')
  }

  protected solve(): void {
    inputIterators.cycleValues(this.inputGeometry, this.inputOffset).forEach(([_geom, _offset]) => {
      const geom = assertIsGeometry(_geom)
      const xy = assertIsXY(_offset)
      const moved = translate(geom, xy)
      this.outputGeometry.next(moved)
    })
  }
}
