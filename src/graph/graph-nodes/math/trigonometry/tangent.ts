import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';
import { GraphNode } from '../../../core/graph-node';
import { GraphNodeType } from '../../decorators';

@GraphNodeType('Math', 'Trigonometry', 'Tangent')
export class Tangent extends GraphNode {
  private input;
  private output;

  constructor(id: string, path: string[]) {
    super(id, path);

    this.input = this.registerNumberInput('Angle (Radians)');
    this.output = this.registerNumberOutput('Tangent Value');
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [value] of inputIterators.cycleValues(this.input)) {
      const result = Math.tan(value);
      this.output.next(result);
    }
  }
}
