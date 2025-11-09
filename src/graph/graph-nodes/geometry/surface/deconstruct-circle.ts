import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { asCircle } from '@/geometry/circle'
import { GraphNode } from '../../../core/graph-node'
import { GraphNodeType } from '../../decorators'

@GraphNodeType('Geometry', 'Surface', 'Deconstruct Circle')
export class DeconstructCircle extends GraphNode {
  private input
  private outputCenter
  private outputRadius

  constructor(modelId: string) {
    super(modelId)

    this.input = this.registerObjectInput('Circle').validate(asCircle)

    this.outputCenter = this.registerObjectOutput('Center')
    this.outputRadius = this.registerNumberOutput('Radius')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [circle] of inputIterators.cycleValues(this.input)) {
      const { x, y, radius } = circle

      this.outputCenter.next({ x, y })
      this.outputRadius.next(radius)
    }
  }
}
