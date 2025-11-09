import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { assertIsFont } from '@/geometry/font'
import { GraphNode } from '../../core/graph-node'
import { GraphNodeType } from '../decorators'

@GraphNodeType('Canvas', 'Deconstruct Font')
export class DeconstructFont extends GraphNode {
  private inputFont

  private outputFamily
  private outputStyle

  constructor(modelId: string) {
    super(modelId)

    this.inputFont = this.registerObjectInput('Font').validate(assertIsFont)

    this.outputFamily = this.registerStringOutput('Family')
    this.outputStyle = this.registerStringOutput('Style')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [font] of inputIterators.cycleValues(this.inputFont)) {
      this.outputFamily.next(font.family)
      this.outputStyle.next(font.style ?? '')
    }
  }
}
