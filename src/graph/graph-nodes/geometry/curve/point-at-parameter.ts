import type { XY } from '@/geometry/xy'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { asCurveLike, getPointAt } from '@/geometry/curve-like'
import { GraphNode } from '../../../core/graph-node'
import { GraphNodeType } from '../../decorators'

@GraphNodeType('Geometry', 'Curve', 'Point At Parameter')
export class PointAtParameter extends GraphNode {
  private curveInput
  private tInput
  private output

  constructor(modelId: string) {
    super(modelId)

    this.curveInput = this.registerObjectInput('Curve').validate(asCurveLike)

    this.tInput = this.registerNumberInput('t')

    this.output = this.registerObjectOutput<XY>('Point')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [curve, t] of inputIterators.cycleValues(this.curveInput, this.tInput)) {
      const point = getPointAt(curve, t)
      this.output.next(point)
    }
  }
}
