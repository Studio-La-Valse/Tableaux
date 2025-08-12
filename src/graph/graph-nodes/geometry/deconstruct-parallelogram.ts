import { deconstruct as deconstructParallelogram } from '@/geometry/parallelogram'
import { GraphNode } from '../../core/graph-node'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { GraphNodeType } from '../decorators'
import { type XY as xy } from '@/geometry/xy'
import { assertIsShape, isOfShapeKind } from '@/geometry/shape'

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

    this.inputShape = this.registerObjectInput('Shape').validate((v) => {
      const geom = assertIsShape(v)

      if (!isOfShapeKind(geom, ['parallelogram', 'rectangle', 'square'])) {
        throw new Error(
          `Unsupported shape kind, expected 'parallelogram', 'rectangle' or 'circle', got: ${geom.kind}`,
        )
      }
      return geom
    })

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

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [geom] of inputIterators.cycleValues(this.inputShape)) {
      const {
        topLeft,
        topRight,
        bottomRight,
        bottomLeft,
        center,
        sideA,
        sideB,
        area,
        perimeter,
        rotation,
      } = deconstructParallelogram(geom)

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
    }
  }
}
