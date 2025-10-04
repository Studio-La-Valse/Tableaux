import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';
import { GraphNode } from '../../core/graph-node';
import { GraphNodeType } from '../decorators';

@GraphNodeType('Text', 'Includes')
export class Includes extends GraphNode {
  private char;
  private input;
  private output;

  constructor(id: string, path: string[]) {
    super(id, path);

    this.char = this.registerStringInput('Characters');
    this.input = this.registerStringInput('Value');
    this.output = this.registerBooleanOutput('Contains');
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [char, val] of inputIterators.cycleValues(
      this.char,
      this.input
    )) {
      this.output.next(char.includes(val));
    }
  }
}
