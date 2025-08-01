import { assertIsXY } from '@/geometry/xy'
import { GraphNode } from '@/graph/core/graph-node'
import { inputIterators } from '@/graph/core/input-iterators'
import { GraphNodeType } from '@/graph/graph-nodes/decorators'
import { createTranslation, type TransformationMatrix } from '@/geometry/transformation-matrix'

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
