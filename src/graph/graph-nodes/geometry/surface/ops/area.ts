import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { surfaceOps } from '@/geometry/primitives/union/surface-ops'
import { GraphNode } from '@/graph/core/graph-node'
import { GraphNodeType } from '@/graph/graph-nodes/decorators'

@GraphNodeType('Geometry', 'Surface', 'Ops', 'Area')
export class AreaNode extends GraphNode {
  private input
  private output

  constructor(modelId: string) {
    super(modelId)

    this.input = this.registerObjectInput('Surface').validate(surfaceOps.cast)
    this.output = this.registerNumberOutput('Area')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [surface] of inputIterators.cycleValues(this.input)) {
      const c = surfaceOps.area(surface)
      this.output.next(c)
    }
  }
}
