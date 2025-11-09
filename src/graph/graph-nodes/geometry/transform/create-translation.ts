import { assertIsXY } from '@/geometry/xy';
import { GraphNode } from '@/graph/core/graph-node';
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';
import { GraphNodeType } from '@/graph/graph-nodes/decorators';
import { createTranslation, type TransformationMatrix } from '@/geometry/transformation-matrix';

@GraphNodeType('Geometry', 'Transform', 'Create Translation')
export class CreateTranslation extends GraphNode {
  private inputOffset;

  private outputGeometry;

  constructor(modelId: string) {
    super(modelId);

    this.inputOffset = this.registerObjectInput('Offset').validate(assertIsXY);

    this.outputGeometry = this.registerObjectOutput<TransformationMatrix>('Transformation Matrix');
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [xy] of inputIterators.cycleValues(this.inputOffset)) {
      const moved = createTranslation(xy);
      this.outputGeometry.next(moved);
    }
  }
}
