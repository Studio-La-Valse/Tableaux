import { assertIsXY } from '@/geometry/xy'
import { GraphNode } from '@/graph/core/graph-node'
import { inputIterators } from '@/graph/core/input-iterators'
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

  protected async solve(): Promise<void> {
    inputIterators
      .cycleValues(this.inputCenter, this.inputFactorX, this.inputFactorY)
      .forEach(([_origin, x, y]) => {
        const origin = assertIsXY(_origin)
        const factor = { x, y }
        const scaled = createScale(origin, factor)
        this.outputGeometry.next(scaled)
      })
  }
}
