import { assertIsXY } from '@/models/geometry/xy'
import { GraphNode } from '@/models/graph/core/graph-node'
import { inputIterators } from '@/models/graph/core/input-iterators'
import { GraphNodeType } from '@/models/graph/graph-nodes/decorators'
import { createScale, type TransformationMatrix } from '@/models/geometry/transformation-matrix'

@GraphNodeType('Geometry', 'Transform', 'Create Scale (Uniform)')
export class CreateScaleUniform extends GraphNode {
  private inputCenter
  private inputFactor

  private outputGeometry

  constructor(id: string, path: string[]) {
    super(id, path)

    this.inputCenter = this.registerObjectInput('Center')
    this.inputFactor = this.registerNumberInput('Scale Factor')

    this.outputGeometry = this.registerObjectOutput<TransformationMatrix>('Transformation Matrix')
  }

  protected solve(): void {
    inputIterators.cycleValues(this.inputCenter, this.inputFactor).forEach(([_origin, factor]) => {
      const origin = assertIsXY(_origin)
      const scaled = createScale(origin, { x: factor, y: factor })
      this.outputGeometry.next(scaled)
    })
  }
}
