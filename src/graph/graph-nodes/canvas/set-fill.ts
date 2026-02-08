import type { Drawable } from '@/geometry/primitives/union/drawable/drawable'
import type { Fill } from '@/geometry/primitives/union/drawable/fill'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { rgbOps } from '@/geometry/color/color-rgb-ops'
import { drawableOps } from '@/geometry/primitives/union/drawable/drawable-ops'
import { GraphNode } from '../../core/graph-node'
import { GraphNodeType } from '../decorators'

@GraphNodeType('Canvas', 'Set Fill')
export class SetFill extends GraphNode {
  private inputGeometry
  private color

  private outputGeometry

  constructor(modelId: string) {
    super(modelId)

    this.inputGeometry = this.registerObjectInput('Geometry').validate(drawableOps.cast)
    this.color = this.registerObjectInput('Color').validate(rgbOps.cast)

    this.outputGeometry = this.registerObjectOutput<Drawable & Fill>('Geometry with fill')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [geom, fill] of inputIterators.cycleValues(this.inputGeometry, this.color)) {
      const withFill = {
        ...geom,
        fill,
      }
      this.outputGeometry.next(withFill)
    }
  }
}
