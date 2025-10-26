import { GraphNode } from '../../../core/graph-node';
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';
import { GraphNodeType } from '../../decorators';
import { type XY as xy } from '@/geometry/xy';
import { asRectangle } from '@/geometry/rectangle';

@GraphNodeType('Geometry', 'Surface', 'Deconstruct Rectangle')
export class DeconstructRectangle extends GraphNode {
  private inputShape;

  private topLeft;
  private width;
  private height;

  constructor(id: string, path: string[]) {
    super(id, path);

    this.inputShape = this.registerObjectInput('Shape').validate(asRectangle);

    this.topLeft = this.registerObjectOutput<xy>('Top Left');
    this.width = this.registerNumberOutput('Width');
    this.height = this.registerNumberOutput('Height');
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [geom] of inputIterators.cycleValues(this.inputShape)) {
      const { x, y, width, height } = geom;

      this.topLeft.next({ x, y });
      this.width.next(width);
      this.height.next(height);
    }
  }
}
