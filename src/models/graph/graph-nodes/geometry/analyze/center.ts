import { type XY } from '@/models/geometry/xy'
import { GraphNode } from '@/models/graph/core/graph-node'
import { inputIterators } from '@/models/graph/core/input-iterators'
import { GraphNodeType } from '@/models/graph/graph-nodes/decorators'
import { getCenter, type Geometry } from '@/models/geometry/geometry'

@GraphNodeType('Geometry', 'Analyze', 'Center')
export class Center extends GraphNode {
  private inputGeometry
  private outputCenter

  constructor(id: string, path: string[]) {
    super(id, path)

    this.inputGeometry = this.registerObjectInput<Geometry>('Geometry')
    this.outputCenter = this.registerObjectOutput<XY>('Center')
  }

  protected solve(): void {
    inputIterators.cycleValues(this.inputGeometry).forEach(([geom]) => {
      const center = getCenter(geom)
      this.outputCenter.next(center)
    })
  }
}
