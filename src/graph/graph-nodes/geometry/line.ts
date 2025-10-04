import { GraphNode } from '../../core/graph-node';
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';
import { GraphNodeType } from '../decorators';
import { assertIsXY } from '@/geometry/xy';
import { createLine, type Line as line } from '@/geometry/line';

@GraphNodeType('Geometry', 'Line')
export class Line extends GraphNode {
  private input1;
  private input2;
  private output;

  constructor(id: string, path: string[]) {
    super(id, path);

    this.input1 = this.registerObjectInput('Start').validate(assertIsXY);
    this.input2 = this.registerObjectInput('End').validate(assertIsXY);
    this.output = this.registerObjectOutput<line>('Line');
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [start, end] of inputIterators.cycleValues(
      this.input1,
      this.input2
    )) {
      const v = createLine(start, end);
      this.output.next(v);
    }
  }
}
