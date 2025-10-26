import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';
import { assertIsXY } from '@/geometry/xy';
import { createPolyline, type PolylineShape } from '@/geometry/polyline';
import { GraphNode } from '@/graph/core/graph-node';
import { GraphNodeType } from '../../decorators';

@GraphNodeType('Geometry', 'Curve', 'Construct Line')
export class Line extends GraphNode {
  private input1;
  private input2;
  private output;

  constructor(id: string, path: string[]) {
    super(id, path);

    this.input1 = this.registerObjectInput('Start').validate(assertIsXY);
    this.input2 = this.registerObjectInput('End').validate(assertIsXY);
    this.output = this.registerObjectOutput<PolylineShape>('Line');
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [start, end] of inputIterators.cycleValues(this.input1, this.input2)) {
      const v = createPolyline(start, end);
      this.output.next(v);
    }
  }
}
