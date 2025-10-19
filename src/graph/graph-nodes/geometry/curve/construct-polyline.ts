import { GraphNode } from '@/graph/core/graph-node';
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';
import { GraphNodeType } from '../../decorators';
import { assertIsXY, type XY } from '@/geometry/xy';
import { createPolyline, type PolylineShape } from '@/geometry/polyline';

@GraphNodeType('Geometry', 'Curve', 'Construct Polyline')
export class ConstructPolyline extends GraphNode {
  private inputStart;
  private inputEnd;
  private inputTargetLength;
  private inputPoints;
  private output;

  constructor(id: string, path: string[]) {
    super(id, path);

    this.inputStart = this.registerObjectInput('Start').validate(assertIsXY);
    this.inputPoints = this.registerObjectInput('Points').validate(assertIsXY);
    this.inputEnd = this.registerObjectInput('End').validate(assertIsXY);
    this.inputTargetLength = this.registerNumberInput('Target Length');

    this.output = this.registerObjectOutput<PolylineShape>('Polyline');
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    let pointIndex = 0;
    const pointsAvailable = this.inputPoints.payloadLength;
    if (pointsAvailable <= 0) {
      throw Error('There a no points available through the Points input.');
    }

    for await (const [start, end, targetLength] of inputIterators.cycleValues(
      this.inputStart,
      this.inputEnd,
      this.inputTargetLength
    )) {
      if (targetLength < 2) {
        throw Error('Found target length  smaller than 2 through Target Length input.');
      }

      // Collect exactly targetLength points from the points iterator
      const pts: XY[] = [];
      for (let i = 0; i < targetLength - 2; i++) {
        const pt = this.inputPoints.peek(pointIndex % pointsAvailable);
        pts.push(pt);
        pointIndex++;
      }

      const polyline = createPolyline(start, end, undefined, ...pts);
      this.output.next(polyline);
    }
  }
}
