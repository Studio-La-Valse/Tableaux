import type { XY } from '@/geometry/primitives/xy'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { xyOps } from '@/geometry/primitives/xy-ops'
import { GraphNode } from '@/graph/core/graph-node'
import { GraphNodeType } from '../../../decorators'

@GraphNodeType('Geometry', 'Vector', 'Ops', 'Multiply')
export class MultiplyVector extends GraphNode {
  private xy
  private factor
  private output

  constructor(modelId: string) {
    super(modelId)

    this.xy = this.registerObjectInput('XY').validate(v => xyOps.cast(v))
    this.factor = this.registerNumberInput('Factor')
    this.output = this.registerObjectOutput<XY>('XY')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [vec, factor] of inputIterators.cycleValues(this.xy, this.factor)) {
      const { x, y } = xyOps.multiply(vec, factor)
      this.output.next({ x, y })
    }
  }
}
