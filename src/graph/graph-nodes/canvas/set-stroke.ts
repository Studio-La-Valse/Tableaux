import type { Drawable } from '@/geometry/primitives/union/drawable/drawable'
import type { Stroke } from '@/geometry/primitives/union/drawable/stroke'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { assertIsColorARGB } from '@/geometry/color/color-rgb'
import { drawableOps } from '@/geometry/primitives/union/drawable/drawable-ops'
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

    this.inputGeometry = this.registerObjectInput('Geometry').validate(drawableOps.cast)
    this.color = this.registerObjectInput('Color').validate(assertIsColorARGB)
    this.strokeWidth = this.registerNumberInput('Stroke Width')

    this.outputGeometry = this.registerObjectOutput<Drawable & Stroke>('Geometry with stroke')
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
