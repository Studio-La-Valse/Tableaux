import { assertIsXY } from '@/models/geometry/xy'
import { GraphNode } from '@/models/graph/core/graph-node'
import { inputIterators } from '@/models/graph/core/input-iterators'
import { GraphNodeType } from '@/models/graph/graph-nodes/decorators'
import {
  createTranslation,
  type TransformationMatrix,
} from '@/models/geometry/transformation-matrix'

@GraphNodeType('Geometry', 'Transform', 'Create Translation')
export class CreateTranslation extends GraphNode {
  private inputOffset

  private outputGeometry

  constructor(id: string, path: string[]) {
    super(id, path)

    this.inputOffset = this.registerObjectInput('Offset')

    this.outputGeometry = this.registerObjectOutput<TransformationMatrix>('Transformation Matrix')
  }

  protected solve(): void {
    inputIterators.cycleValues(this.inputOffset).forEach(([_offset]) => {
      const xy = assertIsXY(_offset)
      const moved = createTranslation(xy)
      this.outputGeometry.next(moved)
    })
  }
}
