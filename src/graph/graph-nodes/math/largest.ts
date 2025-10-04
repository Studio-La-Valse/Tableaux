import { GraphNode } from '@/graph/core/graph-node';
import { GraphNodeType } from '../decorators';
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';

@GraphNodeType('Math', 'Largest')
export class Largest extends GraphNode {
  private numbers;
  private largest;

  constructor(id: string, path: string[]) {
    super(id, path);

    this.numbers = this.registerNumberInput('Numbers');
    this.largest = this.registerNumberOutput('Largest');
  }

  protected override async solve(
    iterators: InputIteratorsAsync
  ): Promise<void> {
    let largest;
    for await (const v of iterators.createGenerator(this.numbers)) {
      if (!largest || v > largest) {
        largest = v;
      }
    }

    if (!largest) {
      throw Error('Sequence of numbers was empty');
    }

    this.largest.next(largest);
  }
}
