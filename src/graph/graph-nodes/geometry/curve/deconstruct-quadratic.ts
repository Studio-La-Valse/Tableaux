import { GraphNode } from '@/graph/core/graph-node';
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';
import { GraphNodeType } from '../../decorators';
import { assertIsQuadraticShape } from '@/geometry/quadratic';
import { asShape } from '@/geometry/shape';

@GraphNodeType('Geometry', 'Curve', 'Deconstruct Quadratic Bézier')
export class DeconstructQuadratic extends GraphNode {
  private input;
  private outputStart;
  private outputControl;
  private outputEnd;

  constructor(id: string, path: string[]) {
    super(id, path);

    this.input = this.registerObjectInput('Quadratic Bézier').validate((v) =>
      assertIsQuadraticShape(asShape(v))
    );

    this.outputStart = this.registerObjectOutput('Start');
    this.outputControl = this.registerObjectOutput('Control');
    this.outputEnd = this.registerObjectOutput('End');
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [quadratic] of inputIterators.cycleValues(this.input)) {
      const { start, control, end } = quadratic;

      this.outputStart.next(start);
      this.outputControl.next(control);
      this.outputEnd.next(end);
    }
  }
}
