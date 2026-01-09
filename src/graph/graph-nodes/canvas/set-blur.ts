import type { Drawable } from '@/geometry/primitives/union/drawable/drawable'
import type { Blur } from '@/geometry/primitives/union/drawable/filter'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { drawableOps } from '@/geometry/primitives/union/drawable/drawable-ops'
import { GraphNode } from '../../core/graph-node'
import { GraphNodeType } from '../decorators'

@GraphNodeType('Canvas', 'Set Blur')
export class SetBlur extends GraphNode {
  private inputGeometry
  private inputSize

  private outputGeometry

  constructor(modelId: string) {
    super(modelId)

    this.inputGeometry = this.registerObjectInput('Shape').validate(drawableOps.cast)
    this.inputSize = this.registerNumberInput('Size')

    this.outputGeometry = this.registerObjectOutput<Drawable & { blur: Blur }>('Geometry with blur')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [geom, size] of inputIterators.cycleValues(
      this.inputGeometry,
      this.inputSize,
    )) {
      const withStroke = {
        ...geom,
        blur: {
          size,
        },
      }
      this.outputGeometry.next(withStroke)
    }
  }
}
