import { assertIsXY } from '@/models/geometry/xy'
import { GraphNode } from '@/models/graph/core/graph-node'
import { inputIterators } from '@/models/graph/core/input-iterators'
import { GraphNodeType } from '@/models/graph/graph-nodes/decorators'
import { createScale, type TransformationMatrix } from '@/models/geometry/transformation-matrix'

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

  protected solve(): void {
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
