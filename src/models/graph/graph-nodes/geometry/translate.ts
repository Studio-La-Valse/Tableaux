import { isCircle } from '@/models/geometry/circle'
import { isLine } from '@/models/geometry/line'
import { isRectangle } from '@/models/geometry/rectangle'
import { isXY, type XY } from '@/models/geometry/xy'
import { GraphNode } from '../../core/graph-node'
import { inputIterators } from '../../core/input-iterators'
import { GraphNodeType } from '../decorators'
import { type Geometry } from '@/models/geometry/geometry'

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
      const { x: dx, y: dy } = offset

      let moved: Geometry

      if (isCircle(geom)) {
        moved = {
          ...geom,
          origin: {
            x: geom.origin.x + dx,
            y: geom.origin.y + dy,
          },
        }
      } else if (isLine(geom)) {
        moved = {
          ...geom,
          start: {
            x: geom.start.x + dx,
            y: geom.start.y + dy,
          },
          end: {
            x: geom.end.x + dx,
            y: geom.end.y + dy,
          },
        }
      } else if (isRectangle(geom)) {
        moved = {
          ...geom,
          topLeft: {
            x: geom.topLeft.x + dx,
            y: geom.topLeft.y + dy,
          },
        }
      } else if (isXY(geom)) {
        moved = {
          x: geom.x + dx,
          y: geom.y + dy,
        }
      } else {
        throw new Error('Unsupported Geometry type')
      }

      this.outputGeometry.next(moved)
    })
  }
}
