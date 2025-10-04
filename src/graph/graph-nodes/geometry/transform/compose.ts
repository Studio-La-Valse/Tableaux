import { GraphNode } from '@/graph/core/graph-node';
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';
import { GraphNodeType } from '@/graph/graph-nodes/decorators';
import {
  assertIsTransformationMatrix,
  compose,
  type TransformationMatrix,
} from '@/geometry/transformation-matrix';

@GraphNodeType('Geometry', 'Transform', 'Compose')
export class Compose extends GraphNode {
  private inputParams;
  private output;

  constructor(id: string, path: string[]) {
    super(id, path);

    this.inputParams = this.registerObjectInputParams('Transformation Matrix');
    this.output = this.registerObjectOutput<TransformationMatrix>(
      'Transformation Matrix'
    );
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const values of inputIterators.cycleValues(
      ...this.inputParams
    )) {
      values
        .map(() => values.map((v) => assertIsTransformationMatrix(v)))
        .map((values) => values.reduce((acc, next) => compose(acc, next)))
        .forEach((v) => this.output.next(v));
    }
  }
}
