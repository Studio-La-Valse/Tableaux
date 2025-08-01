import { GraphNode } from '../../core/graph-node'
import { inputIterators } from '../../core/input-iterators'
import { GraphNodeType } from '../decorators'
import { type XY as xy } from '@/models/geometry/xy'
import { deconstruct as deconstructSquare } from '@/models/geometry/square'
import type { Geometry } from '@/models/geometry/geometry'

@GraphNodeType('Geometry', 'Deconstruct Square')
export class DeconstrucSquare extends GraphNode {

  private inputShape

  private topLeft
  private topRight
  private bottomRight
  private bottomLeft
  private center
  private size
  private rotation
  private area
  private perimeter

  constructor(id: string, path: string[]) {
    super(id, path)

    this.inputShape = this.registerObjectInput<Geometry>('Shape')

    this.topLeft = this.registerObjectOutput<xy>('Origin')
    this.topRight = this.registerObjectOutput<xy>('Origin')
    this.bottomRight = this.registerObjectOutput<xy>('Origin')
    this.bottomLeft = this.registerObjectOutput<xy>('Origin')
    this.center = this.registerObjectOutput<xy>('Origin')
    this.size = this.registerNumberOutput('Size')
    this.rotation = this.registerNumberOutput('Rotation')
    this.area = this.registerNumberOutput('Area')
    this.perimeter = this.registerNumberOutput('Perimeter')
  }

  protected solve(): void {
    inputIterators.cycleValues(this.inputShape).forEach(([shape]) => {
      let topLeft: xy
      let topRight: xy
      let bottomRight: xy
      let bottomLeft: xy
      let center: xy
      let size: number
      let area: number
      let perimeter: number
      let rotation: number

      switch (shape.kind) {
        case 'square': {
          const result = deconstructSquare(shape)
          topLeft = result.topLeft
          topRight = result.topRight
          bottomRight = result.bottomRight
          bottomLeft = result.bottomLeft
          center = result.center
          size = result.size
          area = result.area
          perimeter = result.perimeter
          rotation = result.rotation
          break
        }
        default:
          throw new Error(`Unsupported shape kind: ${shape.kind}`)
      }

      this.topLeft.next(topLeft)
      this.topRight.next(topRight)
      this.bottomRight.next(bottomRight)
      this.bottomLeft.next(bottomLeft)
      this.center.next(center)
      this.size.next(size)
      this.rotation.next(rotation)
      this.area.next(area)
      this.perimeter.next(perimeter)
    })
  }
}
