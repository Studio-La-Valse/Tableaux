import { isCircle } from '@/models/geometry/circle'
import { isLine } from '@/models/geometry/line'
import { isRectangle } from '@/models/geometry/rectangle'
import { isXY, type XY } from '@/models/geometry/xy'
import { GraphNode } from '../../core/graph-node'
import { inputIterators } from '../../core/input-iterators'
import { GraphNodeType } from '../decorators'
import { type Geometry } from '@/models/geometry/geometry'
import { type Rectangle } from '@/models/geometry/rectangle'

@GraphNodeType('Geometry', 'BoundingBox')
export class BoundingBox extends GraphNode {
  private inputGeometry
  private outputBox

  constructor(id: string, path: string[]) {
    super(id, path)

    this.inputGeometry = this.registerObjectInput<Geometry>('Geometry')
    this.outputBox = this.registerObjectOutput<Rectangle>('Bounding Box')
  }

  protected solve(): void {
    inputIterators.cycleValues(this.inputGeometry).forEach(([geom]) => {
      let topLeft: XY
      let width: number
      let height: number

      if (isCircle(geom)) {
        topLeft = {
          x: geom.origin.x - geom.radius,
          y: geom.origin.y - geom.radius,
        }
        width = geom.radius * 2
        height = geom.radius * 2
      } else if (isLine(geom)) {
        const minX = Math.min(geom.start.x, geom.end.x)
        const minY = Math.min(geom.start.y, geom.end.y)
        const maxX = Math.max(geom.start.x, geom.end.x)
        const maxY = Math.max(geom.start.y, geom.end.y)
        topLeft = { x: minX, y: minY }
        width = maxX - minX
        height = maxY - minY
      } else if (isRectangle(geom)) {
        topLeft = geom.topLeft
        width = geom.width
        height = geom.height
      } else if (isXY(geom)) {
        topLeft = geom
        width = 0
        height = 0
      } else {
        throw new Error('Unsupported Geometry type')
      }

      this.outputBox.next({ topLeft, width, height })
    })
  }
}
