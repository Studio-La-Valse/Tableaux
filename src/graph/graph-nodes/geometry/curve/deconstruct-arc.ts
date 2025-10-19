import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';
import { type XY } from '@/geometry/xy';
import { GraphNode } from '@/graph/core/graph-node';
import { GraphNodeType } from '../../decorators';
import { assertIsArcShape } from '@/geometry/arc';
import { assertIsShape } from '@/geometry/shape';

@GraphNodeType('Geometry', 'Deconstruct Arc')
export class DeconstructArc extends GraphNode {
  private inputCircle;

  private outputOrigin;
  private outputRadius;
  private startAngle;
  private endAngle;
  private counterclockwise;

  constructor(id: string, path: string[]) {
    super(id, path);

    this.inputCircle = this.registerObjectInput('Circle').validate((v) =>
      assertIsArcShape(assertIsShape(v))
    );

    this.outputOrigin = this.registerObjectOutput<XY>('Origin');
    this.outputRadius = this.registerNumberOutput('Radius');
    this.startAngle = this.registerNumberOutput('Start Angle');
    this.endAngle = this.registerNumberOutput('End Angle');
    this.counterclockwise = this.registerBooleanOutput('End Angle');
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const shape of inputIterators.createGenerator(this.inputCircle)) {
      const { x, y, radius, startAngle, endAngle, counterclockwise } = shape;

      this.outputOrigin.next({ x, y });
      this.outputRadius.next(radius);
      this.startAngle.next(startAngle);
      this.endAngle.next(endAngle);
      this.counterclockwise.next(counterclockwise);
    }
  }
}
