import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';
import { assertIsXY, multiply, type XY } from '@/geometry/xy';
import { GraphNode } from '@/graph/core/graph-node';
import { GraphNodeType } from '../../decorators';

@GraphNodeType('Geometry', 'Vector', 'Multiply Vector')
export class MultiplyVector extends GraphNode {
  private xy;
  private factor;
  private output;

  constructor(id: string, path: string[]) {
    super(id, path);

    this.xy = this.registerObjectInput('XY').validate((v) => assertIsXY(v));
    this.factor = this.registerNumberInput('Factor');
    this.output = this.registerObjectOutput<XY>('XY');
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [vec, factor] of inputIterators.cycleValues(this.xy, this.factor)) {
      const { x, y } = multiply(vec, factor);
      this.output.next({ x, y });
    }
  }
}
