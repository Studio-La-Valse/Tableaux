import type { Surface as _Surface } from '@/geometry/primitives/union/surface'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { surfaceOps } from '@/geometry/primitives/union/surface-ops'
import { GraphNode } from '../../../core/graph-node'
import { GraphNodeType } from '../../decorators'

@GraphNodeType('Geometry', 'Surface', 'Surface')
export class Surface extends GraphNode {
  private input
  private output

  constructor(modelId: string) {
    super(modelId)

    this.input = this.registerObjectInput('Shape').validate(surfaceOps.cast)

    this.output = this.registerObjectOutput<_Surface>('Curve')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [curve] of inputIterators.cycleValues(this.input)) {
      this.output.next(curve)
    }
  }
}
