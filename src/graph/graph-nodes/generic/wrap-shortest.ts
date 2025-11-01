import { GraphNode } from '../../core/graph-node';
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';
import { GraphNodeType } from '../decorators';

@GraphNodeType('Generic', 'Wrap Shortest')
export class WrapShortest extends GraphNode {
  private input1;
  private input2;
  private output1;
  private output2;

  constructor(id: string, path: string[]) {
    super(id, path);

    this.input1 = this.registerUnknownInput('First');
    this.input2 = this.registerUnknownInput('Second');

    this.output1 = this.registerUnknownOutput('First');
    this.output2 = this.registerUnknownOutput('Second');
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [x, y] of inputIterators.cycleValues(this.input1, this.input2)) {
      this.output1.next(x);
      this.output2.next(y);
    }
  }
}
