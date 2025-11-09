import { GraphNode } from '../../core/graph-node';
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';
import { GraphNodeType } from '../decorators';

@GraphNodeType('Generic', 'Switch')
export class Switch extends GraphNode {
  private input1;
  private params;
  private output;

  constructor(modelId: string) {
    super(modelId);

    this.input1 = this.registerNumberInput('Filter');
    this.params = this.registerUnkownInputParams('Signal');
    this.output = this.registerUnknownOutput('Values');
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [value, ...values] of inputIterators.cycleValues(
      this.input1,
      ...this.params
    )) {
      const res = values[value];
      this.output.next(res);
    }
  }
}
