import type { TransformationMatrix } from '@/geometry/transformation-matrix'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { createScale } from '@/geometry/transformation-matrix'
import { assertIsXY } from '@/geometry/xy'
import { GraphNode } from '@/graph/core/graph-node'
import { GraphNodeType } from '@/graph/graph-nodes/decorators'

@GraphNodeType('Geometry', 'Transform', 'Create Scale (Uniform)')
export class CreateScaleUniform extends GraphNode {
  private inputCenter
  private inputFactor

  private outputGeometry

  constructor(modelId: string) {
    super(modelId)

    this.inputCenter = this.registerObjectInput('Center').validate(assertIsXY)
    this.inputFactor = this.registerNumberInput('Scale Factor')

    this.outputGeometry = this.registerObjectOutput<TransformationMatrix>('Transformation Matrix')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [origin, factor] of inputIterators.cycleValues(
      this.inputCenter,
      this.inputFactor,
    )) {
      const scaled = createScale(origin, { x: factor, y: factor })
      this.outputGeometry.next(scaled)
    }
  }
}
