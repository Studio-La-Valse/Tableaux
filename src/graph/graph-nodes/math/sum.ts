import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';
import { GraphNode } from '../../core/graph-node';
import type { GraphNodeInputNumber } from '../../core/graph-node-input';
import type { GraphNodeOutputType } from '../../core/graph-node-output';
import { GraphNodeType } from '../decorators';

@GraphNodeType('Math', 'Sum')
export class Sum extends GraphNode {
  private input: GraphNodeInputNumber;
  private output: GraphNodeOutputType<number>;

  constructor(modelId: string) {
    super(modelId);

    this.input = this.registerNumberInput('Values');
    this.output = this.registerNumberOutput('Sum');
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    let sum = 0;

    for await (const v of inputIterators.createGenerator(this.input)) {
      sum += v;
    }

    this.output.next(sum);
  }
}
