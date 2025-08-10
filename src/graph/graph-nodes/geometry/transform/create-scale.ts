import { assertIsXY } from '@/geometry/xy'
import { GraphNode } from '@/graph/core/graph-node'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { GraphNodeType } from '@/graph/graph-nodes/decorators'
import { createScale, type TransformationMatrix } from '@/geometry/transformation-matrix'

@GraphNodeType('Geometry', 'Transform', 'Create Scale')
export class CreateScale extends GraphNode {
  private inputCenter
  private inputFactorX
  private inputFactorY

  private outputGeometry

  constructor(id: string, path: string[]) {
    super(id, path)

    this.inputCenter = this.registerObjectInput('Center')
    this.inputFactorX = this.registerNumberInput('X Scale Factor')
    this.inputFactorY = this.registerNumberInput('Y Scale Factor')

    this.outputGeometry = this.registerObjectOutput<TransformationMatrix>('Transformation Matrix')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [_origin, x, y] of inputIterators.cycleValues(
      this.inputCenter,
      this.inputFactorX,
      this.inputFactorY,
    )) {
      const origin = assertIsXY(_origin)
      const factor = { x, y }
      const scaled = createScale(origin, factor)
      this.outputGeometry.next(scaled)
    }
  }
}
