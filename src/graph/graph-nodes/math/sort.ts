import { GraphNode } from '@/graph/core/graph-node';
import { GraphNodeType } from '../decorators';
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';

type valueType = { index: number; value: number };

@GraphNodeType('Generic', 'Sort')
export class Sort extends GraphNode {
  private numbers;
  private sorted;
  private indices;

  constructor(id: string, path: string[]) {
    super(id, path);
    this.numbers = this.registerNumberInput('Values');
    this.sorted = this.registerNumberOutput('Sorted');
    this.indices = this.registerNumberOutput('Index');
  }

  protected override async solve(iterators: InputIteratorsAsync): Promise<void> {
    const values: valueType[] = [];

    let index = 0;
    for await (const value of iterators.createGenerator(this.numbers)) {
      values.push({ index, value });
      index++;
    }

    values
      .sort((a, b) => a.value - b.value)
      .forEach(({ index, value }) => {
        this.sorted.next(value);
        this.indices.next(index);
      });
  }
}
