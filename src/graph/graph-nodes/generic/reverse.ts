import { GraphNode } from '@/graph/core/graph-node';
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';

export class Reverse extends GraphNode {
  private in;
  private out;

  constructor(id: string, path: string[]) {
    super(id, path);

    this.in = this.registerUnkownInput('Input');
    this.out = this.registerUnkownOutput('Output');
  }

  protected async solve(iterators: InputIteratorsAsync): Promise<void> {
    for await (const value of iterators.createGeneratorReversed(this.in)) {
      this.out.next(value);
    }
  }
}
