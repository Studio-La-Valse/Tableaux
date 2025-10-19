import { GraphNode } from '@/graph/core/graph-node';
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';
import { GraphNodeType } from '../../decorators';
import { assertIsPolyline, type PolylineShape } from '@/geometry/polyline';
import type { XY } from '@/geometry/xy';
import { assertIsShape } from '@/geometry/shape';

@GraphNodeType('Geometry', 'Curve', 'Deconstruct Polyline')
export class DeconstructPolyline extends GraphNode {
  private input;
  private outputStart;
  private outputPoints;
  private outputEnd;
  private outputLength;

  constructor(id: string, path: string[]) {
    super(id, path);

    this.input = this.registerObjectInput('Polyline').validate((v) =>
      assertIsPolyline(assertIsShape(v))
    );

    this.outputStart = this.registerObjectOutput<XY>('Start');
    this.outputPoints = this.registerObjectOutput<XY>('Points');
    this.outputEnd = this.registerObjectOutput<XY>('End');
    this.outputLength = this.registerNumberOutput('Length');
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [polyline] of inputIterators.cycleValues(this.input)) {
      const { start, points, end } = polyline as PolylineShape;

      this.outputStart.next(start);
      for (const point of points) {
        this.outputPoints.next(point);
      }
      this.outputEnd.next(end);

      // length = start + intermediate points + end
      const length = 2 + (points?.length ?? 0);
      this.outputLength.next(length);
    }
  }
}
