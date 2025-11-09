import type { TransformationMatrix } from '@/geometry/transformation-matrix'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { createScale } from '@/geometry/transformation-matrix'
import { assertIsXY } from '@/geometry/xy'
import { GraphNode } from '@/graph/core/graph-node'
import { GraphNodeType } from '@/graph/graph-nodes/decorators'

@GraphNodeType('Geometry', 'Transform', 'Create Scale')
export class CreateScale extends GraphNode {
  private inputCenter
  private inputFactorX
  private inputFactorY

  private outputGeometry

  constructor(modelId: string) {
    super(modelId)

    this.inputCenter = this.registerObjectInput('Center').validate(assertIsXY)
    this.inputFactorX = this.registerNumberInput('X Scale Factor')
    this.inputFactorY = this.registerNumberInput('Y Scale Factor')

    this.outputGeometry = this.registerObjectOutput<TransformationMatrix>('Transformation Matrix')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [origin, x, y] of inputIterators.cycleValues(
      this.inputCenter,
      this.inputFactorX,
      this.inputFactorY,
    )) {
      const factor = { x, y }
      const scaled = createScale(origin, factor)
      this.outputGeometry.next(scaled)
    }
  }
}
