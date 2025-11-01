import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';
import { GraphNode } from '../../core/graph-node';
import { GraphNodeType } from '../decorators';

@GraphNodeType('JSON', 'Stringify')
export class Stringify extends GraphNode {
  private input;
  private output;

  constructor(id: string, path: string[]) {
    super(id, path);

    this.input = this.registerUnknownInput('JSON');
    this.output = this.registerStringOutput('String');
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const v of inputIterators.createGenerator(this.input)) {
      const res = JSON.stringify(v);
      this.output.next(res);
    }
  }
}
