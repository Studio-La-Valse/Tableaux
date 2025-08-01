import { GraphNode } from '@/models/graph/core/graph-node'
import { inputIterators } from '@/models/graph/core/input-iterators'
import { GraphNodeType } from '@/models/graph/graph-nodes/decorators'
import {
  assertIsTransformationMatrix,
  compose,
  type TransformationMatrix,
} from '@/models/geometry/transformation-matrix'

@GraphNodeType('Geometry', 'Transform', 'Compose')
export class Compose extends GraphNode {
  private inputParams
  private output

  constructor(id: string, path: string[]) {
    super(id, path)

    this.inputParams = this.registerObjectInputParams('Transformation Matrix')
    this.output = this.registerObjectOutput<TransformationMatrix>('Transformation Matrix')
  }

  protected solve(): void {
    inputIterators
      .cycleValues(...this.inputParams)
      .map((values) => values.map((v) => assertIsTransformationMatrix(v)))
      .map((values) => values.reduce((acc, next) => compose(acc, next)))
      .forEach((v) => this.output.next(v))
  }
}
