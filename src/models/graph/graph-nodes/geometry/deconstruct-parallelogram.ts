import type { Parallelogram } from '@/models/geometry/parallelogram'
import { deconstruct as deconstructParallelogram } from '@/models/geometry/parallelogram'
import { GraphNode } from '../../core/graph-node'
import { inputIterators } from '../../core/input-iterators'
import { GraphNodeType } from '../decorators'
import { type XY as xy } from '@/models/geometry/xy'
import { deconstruct as deconstructRectangle, type Rectangle } from '@/models/geometry/rectangle'
import { deconstruct as deconstructSquare, type Square } from '@/models/geometry/square'

@GraphNodeType('Geometry', 'Deconstruct Parallelogram')
export class DeconstructParallelogram extends GraphNode {
  private inputShape

  private outputOrigin
  private outputWidth
  private outputHeight
  private outputArea
  private outputPerimeter

  constructor(id: string, path: string[]) {
    super(id, path)

    this.inputShape = this.registerObjectInput<Parallelogram | Rectangle | Square>('Shape')

    this.outputOrigin = this.registerObjectOutput<xy>('Origin')
    this.outputWidth = this.registerNumberOutput('Width')
    this.outputHeight = this.registerNumberOutput('Height')
    this.outputArea = this.registerNumberOutput('Area')
    this.outputPerimeter = this.registerNumberOutput('Perimeter')
  }

  protected solve(): void {
    inputIterators.cycleValues(this.inputShape).forEach(([shape]) => {
      let { bottomLeft, sideA, sideB, area, perimeter }: DeconstructedParallelogram
      switch (shape.kind) {
        case 'parallelogram':
          { bottomLeft, sideA, sideB, area, perimeter } = deconstructParallelogram(shape)

          break

        case 'rectangle':
          { bottomLeft, sideA, sideB, area, perimeter } = deconstructRectangle(shape)
        case 'square':
          { bottomLeft, sideA, sideB, area, perimeter } = deconstructSquare(shape)
          break

        default:
          throw new Error(`Unsupported shape kind: ${shape.kind}`)
      }

      this.outputOrigin.next(bottomLeft)
      this.outputWidth.next(sideA)
      this.outputHeight.next(sideB)
      this.outputArea.next(area)
      this.outputPerimeter.next(perimeter)
    })
  }
}
