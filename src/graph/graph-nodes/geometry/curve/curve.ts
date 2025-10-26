import { asCurveLike, type CurveLike } from '@/geometry/curve-like';
import { GraphNode } from '../../../core/graph-node';
import { GraphNodeType } from '../../decorators';
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';

@GraphNodeType('Geometry', 'Curve', 'Curve')
export class Curve extends GraphNode {
  private input;
  private output;

  constructor(id: string, path: string[]) {
    super(id, path);

    this.input = this.registerObjectInput('Shape').validate(asCurveLike);

    this.output = this.registerObjectOutput<CurveLike>('Curve');
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [curve] of inputIterators.cycleValues(this.input)) {
      this.output.next(curve);
    }
  }
}
