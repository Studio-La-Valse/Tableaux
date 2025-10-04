import { assertIsXY } from '@/geometry/xy';
import { GraphNode } from '@/graph/core/graph-node';
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';
import { GraphNodeType } from '@/graph/graph-nodes/decorators';
import {
  createScale,
  type TransformationMatrix,
} from '@/geometry/transformation-matrix';

@GraphNodeType('Geometry', 'Transform', 'Create Scale (Uniform)')
export class CreateScaleUniform extends GraphNode {
  private inputCenter;
  private inputFactor;

  private outputGeometry;

  constructor(id: string, path: string[]) {
    super(id, path);

    this.inputCenter = this.registerObjectInput('Center').validate(assertIsXY);
    this.inputFactor = this.registerNumberInput('Scale Factor');

    this.outputGeometry = this.registerObjectOutput<TransformationMatrix>(
      'Transformation Matrix'
    );
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [origin, factor] of inputIterators.cycleValues(
      this.inputCenter,
      this.inputFactor
    )) {
      const scaled = createScale(origin, { x: factor, y: factor });
      this.outputGeometry.next(scaled);
    }
  }
}
