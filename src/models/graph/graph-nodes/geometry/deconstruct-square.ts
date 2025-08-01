import { GraphNode } from '../../core/graph-node'
import { inputIterators } from '../../core/input-iterators'
import { GraphNodeType } from '../decorators'
import { type XY } from '@/models/geometry/xy'
import { deconstruct as deconstructSquare } from '@/models/geometry/square'
import { assertIsShape, isOfShapeKind } from '@/models/geometry/geometry'

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

    this.inputShape = this.registerObjectInput('Shape')

    this.topLeft = this.registerObjectOutput<XY>('Origin')
    this.topRight = this.registerObjectOutput<XY>('Origin')
    this.bottomRight = this.registerObjectOutput<XY>('Origin')
    this.bottomLeft = this.registerObjectOutput<XY>('Origin')
    this.center = this.registerObjectOutput<XY>('Origin')
    this.size = this.registerNumberOutput('Size')
    this.rotation = this.registerNumberOutput('Rotation')
    this.area = this.registerNumberOutput('Area')
    this.perimeter = this.registerNumberOutput('Perimeter')
  }

  protected solve(): void {
    inputIterators.cycleValues(this.inputShape).forEach(([shape]) => {
      const geom = assertIsShape(shape)

      if (!isOfShapeKind(geom, ['square'])) {
        throw new Error(`Unsupported shape kind: ${geom.kind}`)
      }

      const {
        topLeft,
        topRight,
        bottomRight,
        bottomLeft,
        center,
        size,
        rotation,
        area,
        perimeter,
      } = deconstructSquare(geom)

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
