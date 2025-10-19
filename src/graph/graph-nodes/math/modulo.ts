import { GraphNode } from '../../core/graph-node';
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';
import { GraphNodeType } from '../decorators';

@GraphNodeType('Math', 'Modulo')
export class Modulo extends GraphNode {
  private input1;
  private input2;
  private output;

  constructor(id: string, path: string[]) {
    super(id, path);

    this.input1 = this.registerNumberInput('Values');
    this.input2 = this.registerNumberInput('Factor');
    this.output = this.registerNumberOutput('Result');
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [a, b] of inputIterators.cycleValues(this.input1, this.input2)) {
      if (b <= 0) {
        throw Error('Value cannot be equal to or smaller than 0');
      }

      let v = a;
      while (v < b) {
        v += b;
      }
      const result = v % b;
      this.output.next(result);
    }
  }
}
