import { assertIsSurfaceLike, surfaceToCurve } from '@/geometry/surface-like';
import { assertIsShape } from '@/geometry/shape';
import type { CurveLike } from '@/geometry/curve-like';
import { GraphNode } from '../../../core/graph-node';
import { GraphNodeType } from '../../decorators';
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';

@GraphNodeType('Geometry', 'Curve', 'Curve')
export class Curve extends GraphNode {
  private input;
  private output;

  constructor(id: string, path: string[]) {
    super(id, path);

    this.input = this.registerObjectInput('Surface').validate((v) =>
      assertIsSurfaceLike(assertIsShape(v))
    );

    this.output = this.registerObjectOutput<CurveLike>('Curve');
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [surface] of inputIterators.cycleValues(this.input)) {
      const curve = surfaceToCurve(surface);
      this.output.next(curve);
    }
  }
}
