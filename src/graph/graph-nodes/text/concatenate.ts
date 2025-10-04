import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';
import { GraphNode } from '../../core/graph-node';
import { GraphNodeType } from '../decorators';

@GraphNodeType('Text', 'Concatenate')
export class Concatenate extends GraphNode {
  private char;
  private input;
  private output;

  constructor(id: string, path: string[]) {
    super(id, path);

    this.char = this.registerStringInput('Separator');
    this.input = this.registerStringInput('Values');
    this.output = this.registerStringOutput('Sum');
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    const [char] = inputIterators.singletonOnly(this.char);
    const input = [];

    for await (const v of inputIterators.createGenerator(this.input)) {
      input.push(v);
    }

    const res = input.join(char);
    this.output.next(res);
  }
}
