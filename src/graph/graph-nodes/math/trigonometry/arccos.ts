import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';
import { GraphNode } from '../../../core/graph-node';
import { GraphNodeType } from '../../decorators';

@GraphNodeType('Math', 'Trigonometry', 'Arccos')
export class Arccos extends GraphNode {
  private input;
  private output;

  constructor(id: string, path: string[]) {
    super(id, path);

    this.input = this.registerNumberInput('Cosine Value');
    this.output = this.registerNumberOutput('Angle (Radians)');
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [value] of inputIterators.cycleValues(this.input)) {
      const result = Math.acos(value);
      this.output.next(result);
    }
  }
}
