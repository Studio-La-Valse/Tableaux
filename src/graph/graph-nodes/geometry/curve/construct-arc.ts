import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';
import { assertIsXY } from '@/geometry/xy';
import { createArc, type ArcShape } from '@/geometry/arc';
import { GraphNode } from '@/graph/core/graph-node';
import { GraphNodeType } from '../../decorators';

@GraphNodeType('Geometry', 'Curve', 'Construct Arc')
export class Arc extends GraphNode {
  private input1;
  private input2;
  private input3;
  private input4;
  private input5;
  private outputCircle;

  constructor(modelId: string) {
    super(modelId);

    this.input1 = this.registerObjectInput('XY').validate(assertIsXY);
    this.input2 = this.registerNumberInput('Radius');
    this.input3 = this.registerNumberInput('Start Angle');
    this.input4 = this.registerNumberInput('End Angle');
    this.input5 = this.registerBooleanInput('Clockwise', [false]);

    this.outputCircle = this.registerObjectOutput<ArcShape>('Circle');
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [xy, radius, start, end, clockwise] of inputIterators.cycleValues(
      this.input1,
      this.input2,
      this.input3,
      this.input4,
      this.input5,
    )) {
      const arc = createArc(xy, radius, start, end, clockwise);
      this.outputCircle.next(arc);
    }
  }
}
