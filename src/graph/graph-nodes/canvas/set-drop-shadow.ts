import type { DropShadow } from '@/geometry/filter'
import type { Shape } from '@/geometry/shape'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { assertIsColorARGB } from '@/geometry/color-rgb'
import { applyDropShadow } from '@/geometry/filter'
import { asShape } from '@/geometry/shape'
import { assertIsXY } from '@/geometry/xy'
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

    this.inputGeometry = this.registerObjectInput('Shape').validate(asShape)
    this.inputOffset = this.registerObjectInput('Offset').validate(assertIsXY)
    this.inputColor = this.registerObjectInput('Color').validate(assertIsColorARGB)
    this.inputSize = this.registerNumberInput('Size')

    this.outputGeometry = this.registerObjectOutput<Shape & { dropShadow: DropShadow }>(
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
      const withStroke = applyDropShadow(geom, offset, color, size)
      this.outputGeometry.next(withStroke)
    }
  }
}
