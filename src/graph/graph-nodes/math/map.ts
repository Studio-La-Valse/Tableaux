import { GraphNode } from '@/graph/core/graph-node';
import { GraphNodeType } from '../decorators';
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';

@GraphNodeType('Math', 'Map')
export class Map extends GraphNode {
  private numbers;
  private fromStart;
  private fromEnd;
  private toStart;
  private toEnd;
  private result;

  constructor(id: string, path: string[]) {
    super(id, path);

    this.numbers = this.registerNumberInput('Numbers');
    this.fromStart = this.registerNumberInput('From Start');
    this.fromEnd = this.registerNumberInput('From End');
    this.toStart = this.registerNumberInput('To Start');
    this.toEnd = this.registerNumberInput('To End');
    this.result = this.registerNumberOutput('Result');
  }

  protected override async solve(iterators: InputIteratorsAsync): Promise<void> {
    for await (const [value, inMin, inMax, outMin, outMax] of iterators.cycleValues(
      this.numbers,
      this.fromStart,
      this.fromEnd,
      this.toStart,
      this.toEnd
    )) {
      if (inMin === inMax) {
        throw new Error('Input range cannot have the same min and max values');
      }

      const ratio = (value - inMin) / (inMax - inMin);
      const result = outMin + ratio * (outMax - outMin);
      this.result.next(result);
    }
  }
}
