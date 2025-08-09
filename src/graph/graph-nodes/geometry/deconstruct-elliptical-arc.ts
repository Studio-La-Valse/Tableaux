import { GraphNode } from '../../core/graph-node'
import { inputIterators } from '../../core/input-iterators'
import { GraphNodeType } from '../decorators'
import { type XY } from '@/geometry/xy'
import { assertIsShape, isOfShapeKind } from '@/geometry/shape'
import { deconstruct as deconstructEllipticalArc } from '@/geometry/elliptical-arc'

@GraphNodeType('Geometry', 'Deconstruct Elliptical Arc')
export class DeconstructEllipticalArc extends GraphNode {
  private inputCircle

  private origin
  private radii
  private rotation
  private startAngle
  private endAngle
  private clockwise
  private length
  private startPoint
  private endPoint
  private midPoint

  constructor(id: string, path: string[]) {
    super(id, path)

    this.inputCircle = this.registerObjectInput('Elliptical Arc')

    this.origin = this.registerObjectOutput<XY>('Origin')
    this.radii = this.registerObjectOutput<XY>('Radii')
    this.rotation = this.registerNumberOutput('Rotation')
    this.startAngle = this.registerNumberOutput('Start Angle')
    this.endAngle = this.registerNumberOutput('End Angle')
    this.clockwise = this.registerBooleanOutput('Clockwise')
    this.length = this.registerNumberOutput('Length')
    this.startPoint = this.registerObjectOutput<XY>('Start Point')
    this.endPoint = this.registerObjectOutput<XY>('End Point')
    this.midPoint = this.registerObjectOutput<XY>('Mid Point')
  }

  protected solve(): void {
    inputIterators.cycleValues(this.inputCircle).forEach(([_geom]) => {
      const geom = assertIsShape(_geom)

      if (!isOfShapeKind(geom, ['arc', 'circle', 'elliptical-arc', 'ellipse'])) {
        throw new Error(
          `Unknown geometry type, expected 'arc', 'elliptical-arc', 'ellipse' or 'circle', got ${geom.kind}`,
        )
      }

      const {
        origin,
        radii,
        rotation,
        startAngle,
        endAngle,
        clockwise,
        length: arcLength,
        start: startPoint,
        end: endPoint,
        middle: midPoint,
      } = deconstructEllipticalArc(geom)

      this.origin.next(origin)
      this.radii.next(radii)
      this.rotation.next(rotation)
      this.startAngle.next(startAngle)
      this.endAngle.next(endAngle)
      this.clockwise.next(clockwise)
      this.length.next(arcLength)
      this.startPoint.next(startPoint)
      this.endPoint.next(endPoint)
      this.midPoint.next(midPoint)
    })
  }
}
