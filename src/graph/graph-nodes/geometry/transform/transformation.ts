import { GraphNode } from '@/graph/core/graph-node';
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';
import { GraphNodeType } from '@/graph/graph-nodes/decorators';
import { asShape } from '@/geometry/shape';
import { identity, type TransformationMatrix } from '@/geometry/transformation-matrix';

@GraphNodeType('Geometry', 'Transform', 'Transformation')
export class Transformation extends GraphNode {
  private inputGeometry;

  private outputGeometry;

  constructor(id: string, path: string[]) {
    super(id, path);

    this.inputGeometry = this.registerObjectInput('Geometry').validate(asShape);

    this.outputGeometry = this.registerObjectOutput<TransformationMatrix>('Translated Geometry');
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [geom] of inputIterators.cycleValues(this.inputGeometry)) {
      this.outputGeometry.next(geom.t ?? identity());
    }
  }
}
