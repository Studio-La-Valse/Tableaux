import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { GraphNode } from '../../../core/graph-node'
import { GraphNodeType } from '../../decorators'
import { assertIsColorARGB, toColorHex } from '@/geometry/color-rgb'

@GraphNodeType('Geometry', 'Color', 'Color To Hex')
export class ColorToHex extends GraphNode {
  private input
  private output1

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input = this.registerObjectInput('Color')
    this.output1 = this.registerStringOutput('Hex Value')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [_argb] of inputIterators.cycleValues(this.input)) {
      const argb = assertIsColorARGB(_argb)
      const hex = toColorHex(argb)
      this.output1.next(hex)
    }
  }
}
