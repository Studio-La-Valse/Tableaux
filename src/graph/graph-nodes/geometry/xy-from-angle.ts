import { GraphNode } from '../../core/graph-node';
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';
import { GraphNodeType } from '../decorators';
import { type XY as xy } from '@/geometry/xy';

@GraphNodeType('Geometry', 'XY From Angle')
export class XYFromAngle extends GraphNode {
  private angle;
  private length;
  private output;

  constructor(id: string, path: string[]) {
    super(id, path);

    this.angle = this.registerNumberInput('Angle');
    this.length = this.registerNumberInput('Length', [1]);
    this.output = this.registerObjectOutput<xy>('XY');
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [angle, length] of inputIterators.cycleValues(
      this.angle,
      this.length
    )) {
      const x = length * Math.cos(angle);
      const y = length * Math.sin(angle);
      this.output.next({ x, y });
    }
  }
}
