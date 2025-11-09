import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';
import { assertIsXY, normalize, type XY } from '@/geometry/xy';
import { GraphNode } from '@/graph/core/graph-node';
import { GraphNodeType } from '../../decorators';

@GraphNodeType('Geometry', 'Vector', 'Normalize Vector')
export class NormalizeVector extends GraphNode {
  private xy;
  private output;

  constructor(modelId: string) {
    super(modelId);

    this.xy = this.registerObjectInput('XY').validate((v) => assertIsXY(v));
    this.output = this.registerObjectOutput<XY>('XY');
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [xy] of inputIterators.cycleValues(this.xy)) {
      const { x, y } = normalize(xy);

      this.output.next({ x, y });
    }
  }
}
