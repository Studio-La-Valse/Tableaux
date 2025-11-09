import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';
import { type XY } from '@/geometry/xy';
import { GraphNode } from '@/graph/core/graph-node';
import { GraphNodeType } from '../../decorators';
import { asLine } from '@/geometry/polyline';

@GraphNodeType('Geometry', 'Deconstruct Line')
export class DeconstructLine extends GraphNode {
  private inputLine;

  private outputStart;
  private outputEnd;

  constructor(modelId: string) {
    super(modelId);

    this.inputLine = this.registerObjectInput('Line').validate(asLine);

    this.outputStart = this.registerObjectOutput<XY>('Start');
    this.outputEnd = this.registerObjectOutput<XY>('End');
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [geom] of inputIterators.cycleValues(this.inputLine)) {
      const { start, end } = geom;

      this.outputStart.next(start);
      this.outputEnd.next(end);
    }
  }
}
