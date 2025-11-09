import type { PolylineShape } from '@/geometry/polyline'
import type { XY } from '@/geometry/xy'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { createPolyline } from '@/geometry/polyline'
import { assertIsXY } from '@/geometry/xy'
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
    this.output = this.registerObjectOutput<PolylineShape>('Polyline')
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
      const polyline = createPolyline(pts[0], pts[pts.length - 1], undefined, ...pts.slice(1, -1))

      this.output.next(polyline)
    }
  }
}
