import { createSquare } from '@/geometry/square';
import { GraphNode } from '../../core/graph-node';
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';
import { GraphNodeType } from '../decorators';
import { type Square as square } from '@/geometry/square';
import { assertIsXY } from '@/geometry/xy';

@GraphNodeType('Geometry', 'Square')
export class Square extends GraphNode {
  private inputTopLeft;
  private inputSize;
  private outputSquare;

  constructor(id: string, path: string[]) {
    super(id, path);

    this.inputTopLeft =
      this.registerObjectInput('TopLeft').validate(assertIsXY);
    this.inputSize = this.registerNumberInput('Size');

    this.outputSquare = this.registerObjectOutput<square>('Square');
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [topLeft, size] of inputIterators.cycleValues(
      this.inputTopLeft,
      this.inputSize
    )) {
      const rectangle = createSquare(topLeft, size);
      this.outputSquare.next(rectangle);
    }
  }
}
