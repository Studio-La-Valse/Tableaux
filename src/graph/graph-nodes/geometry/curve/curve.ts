import type { CurveLike } from '@/geometry/curve-like'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { asCurveLike } from '@/geometry/curve-like'
import { GraphNode } from '../../../core/graph-node'
import { GraphNodeType } from '../../decorators'

@GraphNodeType('Geometry', 'Curve', 'Curve')
export class Curve extends GraphNode {
  private input
  private output

  constructor(modelId: string) {
    super(modelId)

    this.input = this.registerObjectInput('Shape').validate(asCurveLike)

    this.output = this.registerObjectOutput<CurveLike>('Curve')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [curve] of inputIterators.cycleValues(this.input)) {
      this.output.next(curve)
    }
  }
}
