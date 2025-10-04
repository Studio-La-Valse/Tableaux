import { GraphNode } from '@/graph/core/graph-node';
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';
import { GraphNodeType } from '@/graph/graph-nodes/decorators';
import {
  getAxisAlignedBoundingBox,
  type AxisAlignedBoundingBox,
} from '@/geometry/axis-aligned-bounding-box';
import { isCurveLike } from '@/geometry/curve-like';
import { isSurfaceLike } from '@/geometry/surface-like';

@GraphNodeType('Geometry', 'Analyze', 'BoundingBox')
export class BoundingBox extends GraphNode {
  private inputGeometry;
  private outputBox;

  constructor(id: string, path: string[]) {
    super(id, path);

    this.inputGeometry = this.registerObjectInput('Geometry').validate((v) => {
      const valid = isSurfaceLike(v) || isCurveLike(v);
      if (!valid) {
        throw new Error('Provided geometry is not surface like or curve like');
      }
      return v;
    });
    this.outputBox =
      this.registerObjectOutput<AxisAlignedBoundingBox>('Bounding Box');
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [geom] of inputIterators.cycleValues(this.inputGeometry)) {
      const aabb = getAxisAlignedBoundingBox(geom);
      this.outputBox.next(aabb);
    }
  }
}
