import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { asQuadratic } from '@/geometry/quadratic'
import { GraphNode } from '@/graph/core/graph-node'
import { GraphNodeType } from '../../decorators'

@GraphNodeType('Geometry', 'Curve', 'Deconstruct Quadratic Bézier')
export class DeconstructQuadratic extends GraphNode {
  private input
  private outputStart
  private outputControl
  private outputEnd

  constructor(modelId: string) {
    super(modelId)

    this.input = this.registerObjectInput('Quadratic Bézier').validate(asQuadratic)

    this.outputStart = this.registerObjectOutput('Start')
    this.outputControl = this.registerObjectOutput('Control')
    this.outputEnd = this.registerObjectOutput('End')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [quadratic] of inputIterators.cycleValues(this.input)) {
      const { start, control, end } = quadratic

      this.outputStart.next(start)
      this.outputControl.next(control)
      this.outputEnd.next(end)
    }
  }
}
