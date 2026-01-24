import type { Quadratic as _Quadratic } from '@/geometry/primitives/quadratic'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { xyOps } from '@/geometry/primitives/xy-ops'
import { GraphNode } from '@/graph/core/graph-node'
import { GraphNodeType } from '../../decorators'

@GraphNodeType('Geometry', 'Curve', 'Construct Quadratic Bézier')
export class ConstructQuadratic extends GraphNode {
  private inputStart
  private inputControl
  private inputEnd
  private output

  constructor(modelId: string) {
    super(modelId)

    this.inputStart = this.registerObjectInput('Start').validate(xyOps.cast)
    this.inputControl = this.registerObjectInput('Control').validate(xyOps.cast)
    this.inputEnd = this.registerObjectInput('End').validate(xyOps.cast)

    this.output = this.registerObjectOutput<_Quadratic>('Quadratic Bézier')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [start, control, end] of inputIterators.cycleValues(
      this.inputStart,
      this.inputControl,
      this.inputEnd,
    )) {
      const quadratic = { start, control, end }
      this.output.next(quadratic)
    }
  }
}
