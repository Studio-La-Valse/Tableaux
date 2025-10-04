import { GraphNode } from '../../core/graph-node';
import type { GraphNodeInputType } from '../../core/graph-node-input';
import type { GraphNodeOutputType } from '../../core/graph-node-output';
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';
import { GraphNodeType } from '../decorators';

@GraphNodeType('Math', 'Multiply')
export class Multiply extends GraphNode {
  private params: GraphNodeInputType<number>[];
  private output: GraphNodeOutputType<number>;

  constructor(id: string, path: string[]) {
    super(id, path);

    this.params = this.registerNumberInputParams('First');
    this.output = this.registerNumberOutput('Result');
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const values of inputIterators.cycleValues(...this.params)) {
      const v = values.reduce((p, c) => p * c);
      this.output.next(v);
    }
  }
}
