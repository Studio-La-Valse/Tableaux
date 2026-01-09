import type { Drawable } from '@/geometry/primitives/union/drawable/drawable'
import type { DropShadow } from '@/geometry/primitives/union/drawable/filter'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { assertIsColorARGB } from '@/geometry/color/color-rgb'
import { drawableOps } from '@/geometry/primitives/union/drawable/drawable-ops'
import { assertIsXY } from '@/geometry/primitives/xy'
import { GraphNode } from '../../core/graph-node'
import { GraphNodeType } from '../decorators'

@GraphNodeType('Canvas', 'Set Drop Shadow')
export class SetDropShadow extends GraphNode {
  private inputGeometry
  private inputOffset
  private inputColor
  private inputSize

  private outputGeometry

  constructor(modelId: string) {
    super(modelId)

    this.inputGeometry = this.registerObjectInput('Shape').validate(drawableOps.cast)
    this.inputOffset = this.registerObjectInput('Offset').validate(assertIsXY)
    this.inputColor = this.registerObjectInput('Color').validate(assertIsColorARGB)
    this.inputSize = this.registerNumberInput('Size')

    this.outputGeometry = this.registerObjectOutput<Drawable & { dropShadow: DropShadow }>(
      'Geometry with shadow',
    )
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [geom, offset, color, size] of inputIterators.cycleValues(
      this.inputGeometry,
      this.inputOffset,
      this.inputColor,
      this.inputSize,
    )) {
      const withStroke = {
        ...geom,
        dropShadow: {
          offset,
          color,
          size,
        },
      }
      this.outputGeometry.next(withStroke)
    }
  }
}
