import { isXY, type XY } from '@/geometry/xy'
import { GraphNode } from '@/graph/core/graph-node'
import { inputIterators } from '@/graph/core/input-iterators'
import { GraphNodeType } from '@/graph/graph-nodes/decorators'
import { assertIsCurveLike, getCenter } from '@/geometry/curve-like'

@GraphNodeType('Geometry', 'Analyze', 'Center')
export class Center extends GraphNode {
  private inputGeometry
  private outputCenter

  constructor(id: string, path: string[]) {
    super(id, path)

    this.inputGeometry = this.registerObjectInput('Geometry')
    this.outputCenter = this.registerObjectOutput<XY>('Center')
  }

  protected async solve(): Promise<void> {
    inputIterators.cycleValues(this.inputGeometry).forEach(([_geom]) => {
      let center: XY

      if (isXY(_geom)) {
        center = { ..._geom }
      } else {
        const geom = assertIsCurveLike(_geom)
        center = getCenter(geom)
      }

      this.outputCenter.next(center)
    })
  }
}
