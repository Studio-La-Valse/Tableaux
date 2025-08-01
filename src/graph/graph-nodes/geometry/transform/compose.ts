import { GraphNode } from '@/graph/core/graph-node'
import { inputIterators } from '@/graph/core/input-iterators'
import { GraphNodeType } from '@/graph/graph-nodes/decorators'
import {
  assertIsTransformationMatrix,
  compose,
  type TransformationMatrix,
} from '@/geometry/transformation-matrix'

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
