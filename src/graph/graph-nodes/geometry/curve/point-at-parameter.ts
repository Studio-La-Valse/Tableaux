import { assertIsCurveLike, getPointAt } from '@/geometry/curve-like';
import { GraphNode } from '../../../core/graph-node';
import { GraphNodeType } from '../../decorators';
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';
import { assertIsShape } from '@/geometry/shape';
import type { XY } from '@/geometry/xy';

@GraphNodeType('Geometry', 'Curve', 'Point At Parameter')
export class PointAtParameter extends GraphNode {
  private curveInput;
  private tInput;
  private output;

  constructor(id: string, path: string[]) {
    super(id, path);

    this.curveInput = this.registerObjectInput('Curve').validate((v) =>
      assertIsCurveLike(assertIsShape(v))
    );

    this.tInput = this.registerNumberInput('t');

    this.output = this.registerObjectOutput<XY>('Point');
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [curve, t] of inputIterators.cycleValues(this.curveInput, this.tInput)) {
      const point = getPointAt(curve, t);
      this.output.next(point);
    }
  }
}
