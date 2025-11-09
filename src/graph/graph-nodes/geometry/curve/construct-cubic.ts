import { GraphNode } from '@/graph/core/graph-node';
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';
import { GraphNodeType } from '../../decorators';
import { assertIsXY } from '@/geometry/xy';
import { createCubic, type CubicShape } from '@/geometry/cubic';

@GraphNodeType('Geometry', 'Curve', 'Construct Cubic Bézier')
export class ConstructCubic extends GraphNode {
  private inputStart;
  private inputControl1;
  private inputControl2;
  private inputEnd;
  private output;

  constructor(modelId: string) {
    super(modelId);

    this.inputStart = this.registerObjectInput('Start').validate(assertIsXY);
    this.inputControl1 = this.registerObjectInput('Control 1').validate(assertIsXY);
    this.inputControl2 = this.registerObjectInput('Control 2').validate(assertIsXY);
    this.inputEnd = this.registerObjectInput('End').validate(assertIsXY);

    this.output = this.registerObjectOutput<CubicShape>('Cubic Bézier');
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [start, control1, control2, end] of inputIterators.cycleValues(
      this.inputStart,
      this.inputControl1,
      this.inputControl2,
      this.inputEnd,
    )) {
      const cubic = createCubic(start, control1, control2, end);
      this.output.next(cubic);
    }
  }
}
