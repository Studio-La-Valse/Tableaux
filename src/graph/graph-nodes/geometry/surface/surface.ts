import { GraphNode } from '../../../core/graph-node';
import { GraphNodeType } from '../../decorators';
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';
import { asSurfaceLike, type SurfaceLike } from '@/geometry/surface-like';

@GraphNodeType('Geometry', 'Surface', 'Surface')
export class Surface extends GraphNode {
  private input;
  private output;

  constructor(id: string, path: string[]) {
    super(id, path);

    this.input = this.registerObjectInput('Shape').validate(asSurfaceLike);

    this.output = this.registerObjectOutput<SurfaceLike>('Curve');
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [curve] of inputIterators.cycleValues(this.input)) {
      this.output.next(curve);
    }
  }
}
