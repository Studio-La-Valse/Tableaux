import { GraphNode } from '../../../core/graph-node';
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';
import { GraphNodeType } from '../../decorators';
import { assertIsXY } from '@/geometry/xy';
import { createEllipse, type EllipseShape } from '@/geometry/ellipse';

@GraphNodeType('Geometry', 'Surface', 'Construct Ellipse')
export class Ellipse extends GraphNode {
  private input1;
  private input2;
  private input3;
  private input4;
  private output;

  constructor(id: string, path: string[]) {
    super(id, path);

    this.input1 = this.registerObjectInput('XY').validate((v) => assertIsXY(v));
    this.input2 = this.registerNumberInput('Radius X');
    this.input3 = this.registerNumberInput('Radius Y');
    this.input4 = this.registerNumberInput('Rotation');

    this.output = this.registerObjectOutput<EllipseShape>('Circle');
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [xy, x, y, rotation] of inputIterators.cycleValues(
      this.input1,
      this.input2,
      this.input3,
      this.input4
    )) {
      const ellipse = createEllipse(xy, x, y, rotation);
      this.output.next(ellipse);
    }
  }
}
