import { GraphNode } from '../../core/graph-node';
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';
import { GraphNodeType } from '../decorators';

@GraphNodeType('Text', 'Join')
export class Join extends GraphNode {
  private char;
  private params;
  private output;

  constructor(modelId: string) {
    super(modelId);

    this.char = this.registerStringInput('Char');
    this.params = this.registerStringInputParams('Text');
    this.output = this.registerStringOutput('Result');
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [value, ...values] of inputIterators.cycleValues(this.char, ...this.params)) {
      const v = values.join(value);
      this.output.next(v);
    }
  }
}
