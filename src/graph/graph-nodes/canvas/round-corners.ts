import { GraphNode } from '../../core/graph-node'
import { GraphNodeType } from '../decorators'
import { assertIsOfShapeKind, assertIsShape } from '@/geometry/shape'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import type { Rectangle } from '@/geometry/rectangle'
import type { RoundCorners as roundCorners } from '@/bitmap-painters/round-corners'
import type { Square } from '@/geometry/square'

@GraphNodeType('Canvas', 'Round Corners')
export class RoundCorners extends GraphNode {
  private inputGeometry
  private topLeft
  private topRight
  private bottomRight
  private bottomLeft

  private outputGeometry

  constructor(id: string, path: string[]) {
    super(id, path)

    this.inputGeometry = this.registerObjectInput('Geometry').validate((v) => {
      const w = assertIsShape(v)
      return assertIsOfShapeKind(w, ['rectangle', 'square'])
    })
    this.topLeft = this.registerNumberInput('1')
    this.topRight = this.registerNumberInput('2')
    this.bottomRight = this.registerNumberInput('3')
    this.bottomLeft = this.registerNumberInput('4')

    this.outputGeometry = this.registerObjectOutput<
      (Square | Rectangle) & roundCorners
    >('Geometry with fill')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [
      geom,
      topLeft,
      topRight,
      bottomRight,
      bottomLeft,
    ] of inputIterators.cycleValues(
      this.inputGeometry,
      this.topLeft,
      this.topRight,
      this.bottomRight,
      this.bottomLeft,
    )) {
      const withFill = {
        ...geom,
        topLeft,
        topRight,
        bottomRight,
        bottomLeft,
      }
      this.outputGeometry.next(withFill)
    }
  }
}
