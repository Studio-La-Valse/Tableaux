import { isCircle } from '@/models/geometry/circle'
import { isLine } from '@/models/geometry/line'
import { isRectangle } from '@/models/geometry/rectangle'
import { isXY, type XY } from '@/models/geometry/xy'
import { GraphNode } from '../../core/graph-node'
import { inputIterators } from '../../core/input-iterators'
import { GraphNodeType } from '../decorators'
import { type Geometry } from '@/models/geometry/geometry'

function scalePoint(p: XY, center: XY, factor: number): XY {
  return {
    x: center.x + (p.x - center.x) * factor,
    y: center.y + (p.y - center.y) * factor
  }
}

@GraphNodeType('Geometry', 'ScaleGeometry')
export class ScaleGeometry extends GraphNode {
  private inputGeometry
  private inputCenter
  private inputFactor

  private outputGeometry

  constructor(id: string, path: string[]) {
    super(id, path)

    this.inputGeometry = this.registerObjectInput<Geometry>('Geometry')
    this.inputCenter = this.registerObjectInput<XY>('Center')
    this.inputFactor = this.registerNumberInput('Scale Factor')

    this.outputGeometry = this.registerObjectOutput<Geometry>('Scaled Geometry')
  }

  protected solve(): void {
    inputIterators.cycleValues(this.inputGeometry, this.inputCenter, this.inputFactor).forEach(
      ([geom, center, factor]) => {
        let scaled: Geometry

        if (isCircle(geom)) {
          scaled = {
            ...geom,
            origin: scalePoint(geom.origin, center, factor),
            radius: geom.radius * factor
          }
        } else if (isLine(geom)) {
          scaled = {
            ...geom,
            start: scalePoint(geom.start, center, factor),
            end: scalePoint(geom.end, center, factor)
          }
        } else if (isRectangle(geom)) {
          scaled = {
            ...geom,
            topLeft: scalePoint(geom.topLeft, center, factor),
            width: geom.width * factor,
            height: geom.height * factor
          }
        } else if (isXY(geom)) {
          scaled = scalePoint(geom, center, factor)
        } else {
          throw new Error('Unsupported Geometry type')
        }

        this.outputGeometry.next(scaled)
      }
    )
  }
}
