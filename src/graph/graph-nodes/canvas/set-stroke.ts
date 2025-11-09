import type { Shape } from '@/geometry/shape'
import type { Stroke } from '@/geometry/stroke'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { assertIsColorARGB } from '@/geometry/color-rgb'
import { asShape } from '@/geometry/shape'
import { GraphNode } from '../../core/graph-node'
import { GraphNodeType } from '../decorators'

@GraphNodeType('Canvas', 'Set Stroke')
export class SetStroke extends GraphNode {
  private inputGeometry
  private color
  private strokeWidth

  private outputGeometry

  constructor(modelId: string) {
    super(modelId)

    this.inputGeometry = this.registerObjectInput('Geometry').validate(asShape)
    this.color = this.registerObjectInput('Color').validate(assertIsColorARGB)
    this.strokeWidth = this.registerNumberInput('Stroke Width')

    this.outputGeometry = this.registerObjectOutput<Shape & Stroke>('Geometry with stroke')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [geom, stroke, strokeWidth] of inputIterators.cycleValues(
      this.inputGeometry,
      this.color,
      this.strokeWidth,
    )) {
      const withStroke = {
        ...geom,
        stroke,
        strokeWidth,
      }
      this.outputGeometry.next(withStroke)
    }
  }
}
