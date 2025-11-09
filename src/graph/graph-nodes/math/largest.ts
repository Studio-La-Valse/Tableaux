import { GraphNode } from '@/graph/core/graph-node';
import { GraphNodeType } from '../decorators';
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';

@GraphNodeType('Math', 'Largest')
export class Largest extends GraphNode {
  private numbers;
  private largest;

  constructor(modelId: string) {
    super(modelId);

    this.numbers = this.registerNumberInput('Numbers');
    this.largest = this.registerNumberOutput('Largest');
  }

  protected override async solve(iterators: InputIteratorsAsync): Promise<void> {
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
