import { GraphNode } from '../../../core/graph-node';
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';
import { GraphNodeType } from '../../decorators';
import { assertIsXY } from '@/geometry/xy';

@GraphNodeType('Geometry', 'Vector', 'Deconstruct XY')
export class DeconstructXY extends GraphNode {
  private inputXY;

  private outputX;
  private outputY;

  constructor(id: string, path: string[]) {
    super(id, path);

    this.inputXY = this.registerObjectInput('XY').validate(assertIsXY);

    this.outputX = this.registerNumberOutput('X');
    this.outputY = this.registerNumberOutput('Y');
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [xy] of inputIterators.cycleValues(this.inputXY)) {
      const { x, y } = xy;

      this.outputX.next(x);
      this.outputY.next(y);
    }
  }
}
