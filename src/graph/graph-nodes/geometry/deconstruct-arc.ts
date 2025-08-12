import { GraphNode } from '../../core/graph-node'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { GraphNodeType } from '../decorators'
import { type XY } from '@/geometry/xy'
import { assertIsShape, isOfShapeKind } from '@/geometry/shape'
import { deconstruct as deconstructArc } from '@/geometry/arc'

@GraphNodeType('Geometry', 'Deconstruct Arc')
export class DeconstructArc extends GraphNode {
  private inputCircle

  private origin
  private radius
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

    this.inputCircle = this.registerObjectInput('Arc').validate((v) => {
      const geom = assertIsShape(v)

      if (!isOfShapeKind(geom, ['arc', 'circle'])) {
        throw new Error(`Unknown geometry type, expected 'arc' or 'circle', got ${geom.kind}`)
      }

      return geom
    })

    this.origin = this.registerObjectOutput<XY>('Origin')
    this.radius = this.registerNumberOutput('Radius')
    this.rotation = this.registerNumberOutput('Rotation')
    this.startAngle = this.registerNumberOutput('Start Angle')
    this.endAngle = this.registerNumberOutput('End Angle')
    this.clockwise = this.registerBooleanOutput('Clockwise')
    this.length = this.registerNumberOutput('Length')
    this.startPoint = this.registerObjectOutput<XY>('Start Point')
    this.endPoint = this.registerObjectOutput<XY>('End Point')
    this.midPoint = this.registerObjectOutput<XY>('Mid Point')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [geom] of inputIterators.cycleValues(this.inputCircle)) {
      const {
        origin,
        radius,
        rotation,
        startAngle,
        endAngle,
        clockwise,
        length: arcLength,
        start: startPoint,
        end: endPoint,
        middle: midPoint,
      } = deconstructArc(geom)

      this.origin.next(origin)
      this.radius.next(radius)
      this.rotation.next(rotation)
      this.startAngle.next(startAngle)
      this.endAngle.next(endAngle)
      this.clockwise.next(clockwise)
      this.length.next(arcLength)
      this.startPoint.next(startPoint)
      this.endPoint.next(endPoint)
      this.midPoint.next(midPoint)
    }
  }
}
