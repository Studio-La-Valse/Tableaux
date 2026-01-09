import type { Polyline as _Polyline } from '@/geometry/primitives/polyline'
import type { XY } from '@/geometry/primitives/xy'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { assertIsXY } from '@/geometry/primitives/xy'
import { GraphNode } from '@/graph/core/graph-node'
import { GraphNodeType } from '../../decorators'

@GraphNodeType('Geometry', 'Curve', 'Construct Polyline')
export class ConstructPolyline extends GraphNode {
  private inputTargetLength
  private inputPoints
  private output

  constructor(modelId: string) {
    super(modelId)

    this.inputPoints = this.registerObjectInput('Points').validate(assertIsXY)
    this.inputTargetLength = this.registerNumberInput('Target Length')
    this.output = this.registerObjectOutput<_Polyline>('Polyline')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    const totalPoints = this.inputPoints.payloadLength

    if (totalPoints < 2) {
      throw new Error('Polyline construction requires at least two points from the Points input.')
    }

    let pointIndex = 0

    for await (const targetLength of inputIterators.createGenerator(this.inputTargetLength)) {
      if (targetLength < 2) {
        throw new Error(`Target Length must be at least 2, but received: ${targetLength}`)
      }

      // Collect exactly `targetLength` points, cycling if necessary
      const pts: XY[] = []
      for (let i = 0; i < targetLength; i++) {
        const pt = this.inputPoints.peek(pointIndex % totalPoints)
        pts.push(pt)
        pointIndex++
      }

      // Construct polyline: start, end, optional transform, intermediate points
      const polyline = {
        start: pts[0],
        end: pts[pts.length - 1],
        points: pts.slice(1, -1),
      }

      this.output.next(polyline)
    }
  }
}
