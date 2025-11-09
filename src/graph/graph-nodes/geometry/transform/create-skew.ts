import { assertIsXY } from '@/geometry/xy';
import { GraphNode } from '@/graph/core/graph-node';
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';
import { GraphNodeType } from '@/graph/graph-nodes/decorators';
import { createSkew, type TransformationMatrix } from '@/geometry/transformation-matrix';

@GraphNodeType('Geometry', 'Transform', 'Create Skew')
export class CreateSkew extends GraphNode {
  private inputCenter;
  private inputFactor;

  private outputGeometry;

  constructor(modelId: string) {
    super(modelId);

    this.inputCenter = this.registerObjectInput('Center').validate(assertIsXY);
    this.inputFactor = this.registerNumberInput('Skew Factor');

    this.outputGeometry = this.registerObjectOutput<TransformationMatrix>('Transformation Matrix');
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [origin, factor] of inputIterators.cycleValues(
      this.inputCenter,
      this.inputFactor
    )) {
      const skewed = createSkew(origin, { x: factor, y: 0 });
      this.outputGeometry.next(skewed);
    }
  }
}
