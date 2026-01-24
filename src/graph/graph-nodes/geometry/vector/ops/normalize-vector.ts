import type { XY } from '@/geometry/primitives/xy'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { xyOps } from '@/geometry/primitives/xy-ops'
import { GraphNode } from '@/graph/core/graph-node'
import { GraphNodeType } from '../../../decorators'

@GraphNodeType('Geometry', 'Vector', 'Ops', 'Normalize')
export class NormalizeVector extends GraphNode {
  private xy
  private output

  constructor(modelId: string) {
    super(modelId)

    this.xy = this.registerObjectInput('XY').validate(v => xyOps.cast(v))
    this.output = this.registerObjectOutput<XY>('XY')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [xy] of inputIterators.cycleValues(this.xy)) {
      const { x, y } = xyOps.normalize(xy)

      this.output.next({ x, y })
    }
  }
}
