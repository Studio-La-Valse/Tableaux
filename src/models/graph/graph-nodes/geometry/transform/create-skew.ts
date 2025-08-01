import { assertIsXY } from '@/models/geometry/xy'
import { GraphNode } from '@/models/graph/core/graph-node'
import { inputIterators } from '@/models/graph/core/input-iterators'
import { GraphNodeType } from '@/models/graph/graph-nodes/decorators'
import { createSkew, type TransformationMatrix } from '@/models/geometry/transformation-matrix'

@GraphNodeType('Geometry', 'Transform', 'Create Skew')
export class CreateSkew extends GraphNode {
  private inputCenter
  private inputFactor

  private outputGeometry

  constructor(id: string, path: string[]) {
    super(id, path)

    this.inputCenter = this.registerObjectInput('Center')
    this.inputFactor = this.registerNumberInput('Skew Factor')

    this.outputGeometry = this.registerObjectOutput<TransformationMatrix>('Transformation Matrix')
  }

  protected solve(): void {
    inputIterators
      .cycleValues(this.inputCenter, this.inputFactor)
      .forEach(([_origin, factor]) => {
        const origin = assertIsXY(_origin)
        const skewed = createSkew(origin, { x: factor, y: 0 })
        this.outputGeometry.next(skewed)
      })
  }
}
