import { isXY, type XY } from '@/geometry/xy';
import { GraphNode } from '@/graph/core/graph-node';
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';
import { GraphNodeType } from '@/graph/graph-nodes/decorators';
import { assertIsCurveLike, getCenter } from '@/geometry/curve-like';

@GraphNodeType('Geometry', 'Analyze', 'Center')
export class Center extends GraphNode {
  private inputGeometry;
  private outputCenter;

  constructor(id: string, path: string[]) {
    super(id, path);

    this.inputGeometry = this.registerObjectInput('Geometry');
    this.outputCenter = this.registerObjectOutput<XY>('Center');
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [_geom] of inputIterators.cycleValues(
      this.inputGeometry
    )) {
      let center: XY;

      if (isXY(_geom)) {
        center = { ..._geom };
      } else {
        const geom = assertIsCurveLike(_geom);
        center = getCenter(geom);
      }

      this.outputCenter.next(center);
    }
  }
}
