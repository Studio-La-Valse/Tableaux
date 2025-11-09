import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';
import { GraphNode } from '../../core/graph-node';
import { GraphNodeType } from '../decorators';

@GraphNodeType('JSON', 'Parse')
export class Parse extends GraphNode {
  private input;
  private output;

  constructor(modelId: string) {
    super(modelId);

    this.input = this.registerStringInput('String');
    this.output = this.registerObjectOutput('JSON');
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const v of inputIterators.createGenerator(this.input)) {
      const res = JSON.parse(v);
      this.output.next(res);
    }
  }
}
