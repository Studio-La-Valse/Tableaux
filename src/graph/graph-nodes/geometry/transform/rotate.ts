import { assertIsXY } from '@/geometry/xy';
import { GraphNode } from '../../../core/graph-node';
import { GraphNodeType } from '../../decorators';
import { assertIsGeometry, rotate, type Geometry } from '@/geometry/geometry';
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';

@GraphNodeType('Geometry', 'Transform', 'Rotate')
export class SetRotation extends GraphNode {
  private inputGeometry;
  private origin;
  private angle;

  private outputGeometry;

  constructor(id: string, path: string[]) {
    super(id, path);

    this.inputGeometry =
      this.registerObjectInput('Geometry').validate(assertIsGeometry);
    this.origin = this.registerObjectInput('Origin').validate(assertIsXY);
    this.angle = this.registerNumberInput('Angle (Radians)');

    this.outputGeometry =
      this.registerObjectOutput<Geometry>('Rotated Geometry');
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [geom, origin, angle] of inputIterators.cycleValues(
      this.inputGeometry,
      this.origin,
      this.angle
    )) {
      const rotated = rotate(geom, origin, angle);
      this.outputGeometry.next(rotated);
    }
  }
}
