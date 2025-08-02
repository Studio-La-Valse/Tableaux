import { type XY } from '@/geometry/xy'
import { GraphNode } from '@/graph/core/graph-node'
import { inputIterators } from '@/graph/core/input-iterators'
import { GraphNodeType } from '@/graph/graph-nodes/decorators'
import { assertIsShape } from '@/geometry/shape'
import { getCenter } from '@/geometry/geometry'

@GraphNodeType('Geometry', 'Analyze', 'Center')
export class Center extends GraphNode {
  private inputGeometry
  private outputCenter

  constructor(id: string, path: string[]) {
    super(id, path)

    this.inputGeometry = this.registerObjectInput('Geometry')
    this.outputCenter = this.registerObjectOutput<XY>('Center')
  }

  protected solve(): void {
    inputIterators.cycleValues(this.inputGeometry).forEach(([_geom]) => {
      const geom = assertIsShape(_geom)
      const center = getCenter(geom)
      this.outputCenter.next(center)
    })
  }
}
