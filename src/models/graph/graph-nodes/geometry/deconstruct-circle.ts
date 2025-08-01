import { GraphNode } from '../../core/graph-node'
import { inputIterators } from '../../core/input-iterators'
import { GraphNodeType } from '../decorators'
import { type XY } from '@/models/geometry/xy'
import { deconstruct } from '@/models/geometry/circle'
import { assertIsShape } from '@/models/geometry/geometry'

@GraphNodeType('Geometry', 'Deconstruct Circle')
export class DeconstructCircle extends GraphNode {
  private inputCircle

  private outputOrigin
  private outputRadius
  private outputRotation
  private outputArea
  private outputCircumference

  constructor(id: string, path: string[]) {
    super(id, path)

    this.inputCircle = this.registerObjectInput('Circle')

    this.outputOrigin = this.registerObjectOutput<XY>('Origin')
    this.outputRadius = this.registerNumberOutput('Radius')
    this.outputRotation = this.registerNumberOutput('Rotation')
    this.outputArea = this.registerNumberOutput('Area')
    this.outputCircumference = this.registerNumberOutput('Circumference')
  }

  protected solve(): void {
    inputIterators.cycleValues(this.inputCircle).forEach(([_geom]) => {
      const geom = assertIsShape(_geom)

      let origin: XY
      let radius: number
      let rotation: number
      let area: number
      let circumference: number

      switch (geom.kind) {
        case 'circle': {
          const result = deconstruct(geom)
          origin = result.origin
          radius = result.radius
          rotation = result.rotation
          area = result.area
          circumference = result.circumference
          break
        }
        default:
          throw new Error(`Unknown geometry type, expected 'circle', got ${geom.kind}`)
      }

      this.outputOrigin.next(origin)
      this.outputRadius.next(radius)
      this.outputRotation.next(rotation)
      this.outputArea.next(area)
      this.outputCircumference.next(circumference)
    })
  }
}
