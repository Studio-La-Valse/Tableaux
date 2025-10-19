import { GraphNode } from '../../../core/graph-node';
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';
import { GraphNodeType } from '../../decorators';
import { assertIsCircleShape } from '@/geometry/circle';
import { assertIsShape } from '@/geometry/shape';

@GraphNodeType('Geometry', 'Surface', 'Deconstruct Circle')
export class DeconstructCircle extends GraphNode {
  private input;
  private outputCenter;
  private outputRadius;

  constructor(id: string, path: string[]) {
    super(id, path);

    this.input = this.registerObjectInput('Circle').validate((v) =>
      assertIsCircleShape(assertIsShape(v))
    );

    this.outputCenter = this.registerObjectOutput('Center');
    this.outputRadius = this.registerNumberOutput('Radius');
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [circle] of inputIterators.cycleValues(this.input)) {
      const { x, y, radius } = circle;

      this.outputCenter.next({ x, y });
      this.outputRadius.next(radius);
    }
  }
}
