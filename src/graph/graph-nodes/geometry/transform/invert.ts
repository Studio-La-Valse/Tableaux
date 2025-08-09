import { GraphNode } from '@/graph/core/graph-node'
import { inputIterators } from '@/graph/core/input-iterators'
import { GraphNodeType } from '@/graph/graph-nodes/decorators'
import {
  assertIsTransformationMatrix,
  invert,
  type TransformationMatrix,
} from '@/geometry/transformation-matrix'

@GraphNodeType('Geometry', 'Transform', 'Invert')
export class Invert extends GraphNode {
  private inputTransform
  private outputTransform

  constructor(id: string, path: string[]) {
    super(id, path)

    this.inputTransform = this.registerObjectInput('Transformation')
    this.outputTransform = this.registerObjectOutput<TransformationMatrix>('Inverted Matrix')
  }

  protected async solve(): Promise<void> {
    inputIterators.cycleValues(this.inputTransform).forEach(([_transform]) => {
      const matrix2d = assertIsTransformationMatrix(_transform)
      const inverted = invert(matrix2d)
      this.outputTransform.next(inverted)
    })
  }
}
