import { GraphNode } from '../../core/graph-node';
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';
import { GraphNodeType } from '../decorators';

@GraphNodeType('Generic', 'Carthesian Product')
export class CarthesianProduct extends GraphNode {
  private input1;
  private input2;
  private output1;
  private output2;

  constructor(modelId: string) {
    super(modelId);

    this.input1 = this.registerUnknownInput('Left');
    this.input2 = this.registerUnknownInput('Right');

    this.output1 = this.registerUnknownOutput('Left');
    this.output2 = this.registerUnknownOutput('Right');
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [x, y] of inputIterators.cartesianProduct(this.input1, this.input2)) {
      this.output1.next(x);
      this.output2.next(y);
    }
  }
}
