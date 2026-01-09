import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { curveOps } from '@/geometry/primitives/union/curve-ops'
import { GraphNode } from '../../../../core/graph-node'
import { GraphNodeType } from '../../../decorators'

@GraphNodeType('Geometry', 'Curve', 'Ops', 'Length')
export class LengthNode extends GraphNode {
  private curveInput
  private output

  constructor(modelId: string) {
    super(modelId)

    this.curveInput = this.registerObjectInput('Curve').validate(curveOps.cast)
    this.output = this.registerNumberOutput('Length')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [curve] of inputIterators.cycleValues(this.curveInput)) {
      const length = curveOps.length(curve)
      this.output.next(length)
    }
  }
}
