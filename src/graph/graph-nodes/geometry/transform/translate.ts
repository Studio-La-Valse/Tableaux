import { assertIsXY } from '@/geometry/xy'
import { GraphNode } from '@/graph/core/graph-node'
import { inputIterators } from '@/graph/core/input-iterators'
import { GraphNodeType } from '@/graph/graph-nodes/decorators'
import { assertIsGeometry, translate, type Geometry } from '@/geometry/geometry'

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
