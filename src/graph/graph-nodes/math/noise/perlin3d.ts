import { GraphNode } from '@/graph/core/graph-node';
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';
import Perlin from '@/noise/perlin';
import { GraphNodeType } from '../../decorators';

@GraphNodeType('Math', 'Noise', 'Perlin 3d')
export class Perlin3d extends GraphNode {
  private input1;
  private input2;
  private input3;
  private inputScale;

  private output;

  private perlin;

  constructor(modelId: string) {
    super(modelId);

    this.input1 = this.registerNumberInput('X');
    this.input2 = this.registerNumberInput('Y');
    this.input3 = this.registerNumberInput('Z');
    this.inputScale = this.registerNumberInput('Scale');
    this.output = this.registerNumberOutput('Value');
    this.perlin = new Perlin();
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [x, y, z, scale] of inputIterators.cycleValues(
      this.input1,
      this.input2,
      this.input3,
      this.inputScale
    )) {
      const v = this.perlin.perlin3(x / scale, y / scale, z / scale);
      this.output.next(v);
    }
  }
}
