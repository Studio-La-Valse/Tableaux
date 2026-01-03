import type { Blur } from '@/geometry/drawable/filter'
import type { Shape } from '@/geometry/drawable/shapes/shape'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { applyBlur } from '@/geometry/drawable/filter'
import { asShape } from '@/geometry/drawable/shapes/shape'
import { GraphNode } from '../../core/graph-node'
import { GraphNodeType } from '../decorators'

@GraphNodeType('Canvas', 'Set Blur')
export class SetBlur extends GraphNode {
  private inputGeometry
  private inputSize

  private outputGeometry

  constructor(modelId: string) {
    super(modelId)

    this.inputGeometry = this.registerObjectInput('Shape').validate(asShape)
    this.inputSize = this.registerNumberInput('Size')

    this.outputGeometry = this.registerObjectOutput<Shape & { blur: Blur }>('Geometry with blur')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [geom, size] of inputIterators.cycleValues(
      this.inputGeometry,
      this.inputSize,
    )) {
      const withStroke = applyBlur(geom, size)
      this.outputGeometry.next(withStroke)
    }
  }
}
