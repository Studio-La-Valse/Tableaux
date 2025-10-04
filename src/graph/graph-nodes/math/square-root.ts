import { GraphNode } from '@/graph/core/graph-node';
import { GraphNodeType } from '../decorators';
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';

@GraphNodeType('Math', 'Square Root')
export class SquareRoot extends GraphNode {
  private numbers;
  private output;
  constructor(id: string, path: string[]) {
    super(id, path);
    this.numbers = this.registerNumberInput('Numbers');
    this.output = this.registerNumberOutput('Square Root');
  }

  protected override async solve(
    iterators: InputIteratorsAsync
  ): Promise<void> {
    for await (const n of iterators.createGenerator(this.numbers)) {
      this.output.next(Math.sqrt(n));
    }
  }
}
