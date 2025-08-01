import { GraphNode } from '@/models/graph/core/graph-node'
import { inputIterators } from '@/models/graph/core/input-iterators'
import { GraphNodeType } from '@/models/graph/graph-nodes/decorators'
import {
  assertIsTransformationMatrix,
  invert,
  type TransformationMatrix,
} from '@/models/geometry/transformation-matrix'

@GraphNodeType('Geometry', 'Transform', 'Invert')
export class Invert extends GraphNode {
  private inputTransform
  private outputTransform

  constructor(id: string, path: string[]) {
    super(id, path)

    this.inputTransform = this.registerObjectInput('Transformation')
    this.outputTransform = this.registerObjectOutput<TransformationMatrix>('Inverted Matrix')
  }

  protected solve(): void {
    inputIterators.cycleValues(this.inputTransform).forEach(([_transform]) => {
      const matrix2d = assertIsTransformationMatrix(_transform)
      const inverted = invert(matrix2d)
      this.outputTransform.next(inverted)
    })
  }
}
