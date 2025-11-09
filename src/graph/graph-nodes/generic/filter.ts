import { GraphNode } from '../../core/graph-node';
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';
import { GraphNodeType } from '../decorators';

@GraphNodeType('Generic', 'Filter')
export class Filter extends GraphNode {
  private input1;
  private input2;
  private output;

  constructor(modelId: string) {
    super(modelId);

    this.input1 = this.registerUnknownInput('Signal');
    this.input2 = this.registerBooleanInput('Filter');
    this.output = this.registerUnknownOutput('Values');
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [left, right] of inputIterators.cycleValues(this.input1, this.input2)) {
      if (right) {
        this.output.next(left);
      }
    }
  }
}
