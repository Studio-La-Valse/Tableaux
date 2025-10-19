import { assertIsSurfaceLike, getSurfaceCenter } from '@/geometry/surface-like';
import { GraphNode } from '../../../core/graph-node';
import { GraphNodeType } from '../../decorators';
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';
import { assertIsShape } from '@/geometry/shape';
import type { XY } from '@/geometry/xy';

@GraphNodeType('Geometry', 'Surface', 'Center')
export class GetSurfaceCenter extends GraphNode {
  private input;
  private output;

  constructor(id: string, path: string[]) {
    super(id, path);

    this.input = this.registerObjectInput('Surface').validate((v) =>
      assertIsSurfaceLike(assertIsShape(v))
    );
    this.output = this.registerObjectOutput<XY>('Center');
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [surface] of inputIterators.cycleValues(this.input)) {
      const center = getSurfaceCenter(surface);
      this.output.next(center);
    }
  }
}
