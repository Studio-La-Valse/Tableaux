import { GraphNode } from '@/graph/core/graph-node';
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';
import { GraphNodeType } from '../../decorators';
import { assertIsXY } from '@/geometry/xy';
import { createQuadratic, type QuadraticShape } from '@/geometry/quadratic';

@GraphNodeType('Geometry', 'Curve', 'Construct Quadratic Bézier')
export class ConstructQuadratic extends GraphNode {
  private inputStart;
  private inputControl;
  private inputEnd;
  private output;

  constructor(modelId: string) {
    super(modelId);

    this.inputStart = this.registerObjectInput('Start').validate(assertIsXY);
    this.inputControl = this.registerObjectInput('Control').validate(assertIsXY);
    this.inputEnd = this.registerObjectInput('End').validate(assertIsXY);

    this.output = this.registerObjectOutput<QuadraticShape>('Quadratic Bézier');
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [start, control, end] of inputIterators.cycleValues(
      this.inputStart,
      this.inputControl,
      this.inputEnd,
    )) {
      const quadratic = createQuadratic(start, control, end);
      this.output.next(quadratic);
    }
  }
}
