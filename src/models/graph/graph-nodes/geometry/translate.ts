import { type XY } from '@/models/geometry/xy'
import { GraphNode } from '../../core/graph-node'
import { inputIterators } from '../../core/input-iterators'
import { GraphNodeType } from '../decorators'
import { translate, type Geometry } from '@/models/geometry/geometry'

@GraphNodeType('Geometry', 'Translate')
export class Translate extends GraphNode {
  private inputGeometry
  private inputOffset

  private outputGeometry

  constructor(id: string, path: string[]) {
    super(id, path)

    this.inputGeometry = this.registerObjectInput<Geometry>('Geometry')
    this.inputOffset = this.registerObjectInput<XY>('Offset')

    this.outputGeometry = this.registerObjectOutput<Geometry>('Translated Geometry')
  }

  protected solve(): void {
    inputIterators.cycleValues(this.inputGeometry, this.inputOffset).forEach(([geom, offset]) => {
      const moved = translate(geom, offset)
      this.outputGeometry.next(moved)
    })
  }
}
