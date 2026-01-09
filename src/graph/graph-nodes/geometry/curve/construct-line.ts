import type { Line as _Line } from '@/geometry/primitives/line'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { xyOps } from '@/geometry/primitives/xy-ops'
import { GraphNode } from '@/graph/core/graph-node'
import { GraphNodeType } from '../../decorators'

@GraphNodeType('Geometry', 'Curve', 'Construct Line')
export class Line extends GraphNode {
  private input1
  private input2
  private output

  constructor(modelId: string) {
    super(modelId)

    this.input1 = this.registerObjectInput('Start').validate(xyOps.cast)
    this.input2 = this.registerObjectInput('End').validate(xyOps.cast)
    this.output = this.registerObjectOutput<_Line>('Line')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [start, end] of inputIterators.cycleValues(this.input1, this.input2)) {
      const v = { start, end }
      this.output.next(v)
    }
  }
}
