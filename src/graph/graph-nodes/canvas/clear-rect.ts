import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';
import { assertIsRectangleShape } from '@/geometry/rectangle';
import { GraphNode } from '@/graph/core/graph-node';
import { GraphNodeType } from '../decorators';
import { assertIsShape } from '@/geometry/shape';
import type { ClearRectShape } from '@/geometry/clear-rect';

@GraphNodeType('Geometry', 'Surface', 'Construct Rectangle')
export class Rectangle extends GraphNode {
  private inputRect;
  private outputRect;

  constructor(id: string, path: string[]) {
    super(id, path);

    this.inputRect = this.registerObjectInput('Rect').validate((v) =>
      assertIsRectangleShape(assertIsShape(v))
    );
    this.outputRect = this.registerObjectOutput<ClearRectShape>('Rectangle');
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const rect of inputIterators.createGenerator(this.inputRect)) {
      const clearRect: ClearRectShape = {
        ...rect,
        kind: 'clear-rect',
      };
      this.outputRect.next(clearRect);
    }
  }
}
