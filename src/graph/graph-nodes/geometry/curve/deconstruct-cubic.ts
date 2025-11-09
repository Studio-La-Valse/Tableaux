import { GraphNode } from '@/graph/core/graph-node';
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';
import { GraphNodeType } from '../../decorators';
import { asCubic } from '@/geometry/cubic';

@GraphNodeType('Geometry', 'Curve', 'Deconstruct Cubic Bézier')
export class DeconstructCubic extends GraphNode {
  private input;
  private outputStart;
  private outputControl1;
  private outputControl2;
  private outputEnd;

  constructor(modelId: string) {
    super(modelId);

    this.input = this.registerObjectInput('Cubic Bézier').validate(asCubic);

    this.outputStart = this.registerObjectOutput('Start');
    this.outputControl1 = this.registerObjectOutput('Control 1');
    this.outputControl2 = this.registerObjectOutput('Control 2');
    this.outputEnd = this.registerObjectOutput('End');
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [cubic] of inputIterators.cycleValues(this.input)) {
      const { start, control1, control2, end } = cubic;

      this.outputStart.next(start);
      this.outputControl1.next(control1);
      this.outputControl2.next(control2);
      this.outputEnd.next(end);
    }
  }
}
