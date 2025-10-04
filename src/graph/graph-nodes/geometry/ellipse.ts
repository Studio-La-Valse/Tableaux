import { GraphNode } from '../../core/graph-node';
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';
import { GraphNodeType } from '../decorators';
import { assertIsXY } from '@/geometry/xy';
import { createEllipse, type Ellipse as ellipse } from '@/geometry/ellipse';

@GraphNodeType('Geometry', 'Ellipse')
export class Ellipse extends GraphNode {
  private input1;
  private input2;
  private input3;
  private output;

  constructor(id: string, path: string[]) {
    super(id, path);

    this.input1 = this.registerObjectInput('XY').validate((v) => assertIsXY(v));
    this.input2 = this.registerNumberInput('Radius X');
    this.input3 = this.registerNumberInput('Radius Y');

    this.output = this.registerObjectOutput<ellipse>('Circle');
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [xy, x, y] of inputIterators.cycleValues(
      this.input1,
      this.input2,
      this.input3
    )) {
      const ellipse = createEllipse(xy, { x, y });
      this.output.next(ellipse);
    }
  }
}
