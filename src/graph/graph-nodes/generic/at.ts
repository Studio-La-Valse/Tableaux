import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';
import { GraphNode } from '../../core/graph-node';
import { GraphNodeType } from '../decorators';

@GraphNodeType('Generic', 'At')
export class At extends GraphNode {
  private input;
  private input2;
  private output;

  constructor(modelId: string) {
    super(modelId);

    this.input = this.registerUnknownInput('Input');
    this.input2 = this.registerNumberInput('Index');
    this.output = this.registerUnknownOutput('Value');
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const index of inputIterators.createGenerator(this.input2)) {
      const v = this.input.peek(index);
      this.output.next(v);
    }
  }
}
