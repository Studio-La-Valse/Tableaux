import { GraphNode } from '../../core/graph-node'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { GraphNodeType } from '../decorators'
import { assertIsFont } from '@/geometry/font'

@GraphNodeType('Canvas', 'Deconstruct Font')
export class DeconstructFont extends GraphNode {
  private inputFont

  private outputFamily
  private outputStyle

  constructor(id: string, path: string[]) {
    super(id, path)

    this.inputFont = this.registerObjectInput('Font').validate(assertIsFont)

    this.outputFamily = this.registerStringOutput('Family')
    this.outputStyle = this.registerStringOutput('Style')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [font] of inputIterators.cycleValues(this.inputFont)) {

      this.outputFamily.next(font.family)
      this.outputStyle.next(font.style ?? "")
    }
  }
}
