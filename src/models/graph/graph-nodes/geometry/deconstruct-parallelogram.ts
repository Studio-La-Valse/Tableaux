import { deconstruct as deconstructParallelogram } from '@/models/geometry/parallelogram'
import { GraphNode } from '../../core/graph-node'
import { inputIterators } from '../../core/input-iterators'
import { GraphNodeType } from '../decorators'
import { type XY as xy } from '@/models/geometry/xy'
import { deconstruct as deconstructRectangle } from '@/models/geometry/rectangle'
import { deconstruct as deconstructSquare } from '@/models/geometry/square'
import { assertIsShape } from '@/models/geometry/geometry'

@GraphNodeType('Geometry', 'Deconstruct Parallelogram')
export class DeconstructParallelogram extends GraphNode {
  private inputShape

  private topLeft
  private topRight
  private bottomRight
  private bottomLeft
  private center
  private sideA
  private sideB
  private area
  private perimeter
  private rotation

  constructor(id: string, path: string[]) {
    super(id, path)

    this.inputShape = this.registerObjectInput('Shape')

    this.topLeft = this.registerObjectOutput<xy>('Origin')
    this.topRight = this.registerObjectOutput<xy>('Origin')
    this.bottomRight = this.registerObjectOutput<xy>('Origin')
    this.bottomLeft = this.registerObjectOutput<xy>('Origin')
    this.center = this.registerObjectOutput<xy>('Origin')
    this.sideA = this.registerNumberOutput('Side A')
    this.sideB = this.registerNumberOutput('Side B')
    this.area = this.registerNumberOutput('Area')
    this.perimeter = this.registerNumberOutput('Perimeter')
    this.rotation = this.registerNumberOutput('Rotation')
  }

  protected solve(): void {
    inputIterators.cycleValues(this.inputShape).forEach(([_shape]) => {
      const geom = assertIsShape(_shape)

      let topLeft: xy
      let topRight: xy
      let bottomRight: xy
      let bottomLeft: xy
      let center: xy
      let sideA: number
      let sideB: number
      let area: number
      let perimeter: number
      let rotation: number

      switch (geom.kind) {
        case 'parallelogram': {
          const result = deconstructParallelogram(geom)
          topLeft = result.topLeft
          topRight = result.topRight
          bottomRight = result.bottomRight
          bottomLeft = result.bottomLeft
          center = result.center
          sideA = result.sideA
          sideB = result.sideB
          area = result.area
          perimeter = result.perimeter
          rotation = result.rotation
          break
        }
        case 'rectangle': {
          const result = deconstructRectangle(geom)
          topLeft = result.topLeft
          topRight = result.topRight
          bottomRight = result.bottomRight
          bottomLeft = result.bottomLeft
          center = result.center
          sideA = result.width
          sideB = result.height
          area = result.area
          perimeter = result.perimeter
          rotation = result.rotation
          break
        }
        case 'square': {
          const result = deconstructSquare(geom)
          topLeft = result.topLeft
          topRight = result.topRight
          bottomRight = result.bottomRight
          bottomLeft = result.bottomLeft
          center = result.center
          sideA = result.size
          sideB = result.size
          area = result.area
          perimeter = result.perimeter
          rotation = result.rotation
          break
        }
        default:
          throw new Error(
            `Unsupported shape kind, expected 'parallelogram', 'rectangle' or 'circle', got: ${geom.kind}`,
          )
      }

      this.topLeft.next(topLeft)
      this.topRight.next(topRight)
      this.bottomRight.next(bottomRight)
      this.bottomLeft.next(bottomLeft)
      this.center.next(center)
      this.sideA.next(sideA)
      this.sideB.next(sideB)
      this.area.next(area)
      this.perimeter.next(perimeter)
      this.rotation.next(rotation)
    })
  }
}
