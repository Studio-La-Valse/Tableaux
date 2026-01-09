import type { Curve as _Curve } from '@/geometry/primitives/union/curve'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { curveOps } from '@/geometry/primitives/union/curve-ops'
import { GraphNode } from '../../../core/graph-node'
import { GraphNodeType } from '../../decorators'

@GraphNodeType('Geometry', 'Curve', 'Curve')
export class Curve extends GraphNode {
  private input
  private output

  constructor(modelId: string) {
    super(modelId)

    this.input = this.registerObjectInput('Shape').validate(curveOps.cast)

    this.output = this.registerObjectOutput<_Curve>('Curve')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [curve] of inputIterators.cycleValues(this.input)) {
      this.output.next(curve)
    }
  }
}
