import { GraphNode } from '../../core/graph-node'
import { inputIterators } from '../../core/input-iterators'
import { GraphNodeType } from '../decorators'
import { type XY as xy } from '@/models/geometry/xy'
import { deconstruct as deconstructCircle } from '@/models/geometry/circle'
import { deconstruct as deconstructEllipse } from '@/models/geometry/ellipse'
import type { Geometry } from '@/models/geometry/geometry'

@GraphNodeType('Geometry', 'Deconstruct Ellipse')
export class DeconstructEllipse extends GraphNode {
  private inputCircle

  private outputOrigin
  private outputRadiusX
  private outputRadiusY
  private outputRotation
  private outputArea
  private outputCircumference

  constructor(id: string, path: string[]) {
    super(id, path)

    this.inputCircle = this.registerObjectInput<Geometry>('Circle')

    this.outputOrigin = this.registerObjectOutput<xy>('Origin')
    this.outputRadiusX = this.registerNumberOutput('Radius X')
    this.outputRadiusY = this.registerNumberOutput('Radius Y')
    this.outputRotation = this.registerNumberOutput('Rotation')
    this.outputArea = this.registerNumberOutput('Area')
    this.outputCircumference = this.registerNumberOutput('Circumference')
  }

  protected solve(): void {
    inputIterators.cycleValues(this.inputCircle).forEach(([geom]) => {
      let origin: xy
      let radiusX: number
      let radiusY: number
      let rotation: number
      let area: number
      let circumference: number

      switch (geom.kind) {
        case 'circle': {
          const result = deconstructCircle(geom)
          origin = result.origin
          radiusX = result.radius
          radiusY = result.radius
          rotation = result.rotation
          area = result.area
          circumference = result.circumference
          break
        }
        case 'ellipse': {
          const result = deconstructEllipse(geom)
          origin = result.origin
          radiusX = result.radiusX
          radiusY = result.radiusY
          rotation = result.rotation
          area = result.area
          circumference = result.circumference
          break
        }
        default:
          throw new Error(`Unknown geometry type, expected 'circle' or 'ellipse', got ${geom.kind}`)
      }

      this.outputOrigin.next(origin)
      this.outputRadiusX.next(radiusX)
      this.outputRadiusY.next(radiusY)
      this.outputRotation.next(rotation)
      this.outputArea.next(area)
      this.outputCircumference.next(circumference)
    })
  }
}
