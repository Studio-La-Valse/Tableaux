import { type XY } from '@/models/geometry/xy'
import { GraphNode } from '../../core/graph-node'
import { inputIterators } from '../../core/input-iterators'
import { GraphNodeType } from '../decorators'
import { type Geometry } from '@/models/geometry/geometry'
import { getCenter as getCenterCircle } from '@/models/geometry/circle'
import { getCenter as getCenterLine } from '@/models/geometry/line'
import { getCenter as getCenterRectangle } from '@/models/geometry/rectangle'

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

      switch (geom.kind) {
        case 'circle':
          center = getCenterCircle(geom)
          break
        case 'line':
          center = getCenterLine(geom)
          break
        case 'rectangle':
          center = getCenterRectangle(geom)
          break
        default:
          throw new Error('Unsupported Geometry type')
      }

      this.outputCenter.next(center)
    })
  }
}
