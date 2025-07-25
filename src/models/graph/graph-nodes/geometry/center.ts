import { isCircle } from '@/models/geometry/circle'
import { isLine } from '@/models/geometry/line'
import { isRectangle } from '@/models/geometry/rectangle'
import { isXY, type XY } from '@/models/geometry/xy'
import { GraphNode } from '../../core/graph-node'
import { inputIterators } from '../../core/input-iterators'
import { GraphNodeType } from '../decorators'
import { type Geometry } from '@/models/geometry/geometry'

@GraphNodeType('Geometry', 'Center')
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
      let center: XY

      if (isCircle(geom)) {
        center = geom.origin
      } else if (isLine(geom)) {
        center = {
          x: (geom.start.x + geom.end.x) / 2,
          y: (geom.start.y + geom.end.y) / 2
        }
      } else if (isRectangle(geom)) {
        center = {
          x: geom.topLeft.x + geom.width / 2,
          y: geom.topLeft.y + geom.height / 2
        }
      } else if (isXY(geom)) {
        center = geom
      } else {
        throw new Error('Unsupported Geometry type')
      }

      this.outputCenter.next(center)
    })
  }
}
