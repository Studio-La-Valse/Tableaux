import type { XY } from '@/geometry/primitives/xy'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { surfaceOps } from '@/geometry/primitives/union/surface-ops'
import { GraphNode } from '../../../../core/graph-node'
import { GraphNodeType } from '../../../decorators'

@GraphNodeType('Geometry', 'Surface', 'Ops', 'Center')
export class GetSurfaceCenter extends GraphNode {
  private input
  private output

  constructor(modelId: string) {
    super(modelId)

    this.input = this.registerObjectInput('Surface').validate(surfaceOps.cast)
    this.output = this.registerObjectOutput<XY>('Center')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [surface] of inputIterators.cycleValues(this.input)) {
      const center = surfaceOps.center(surface)
      this.output.next(center)
    }
  }
}
