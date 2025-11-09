import { GraphNode } from '@/graph/core/graph-node';
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';
import { GraphNodeType } from '@/graph/graph-nodes/decorators';
import { type XY } from '@/geometry/xy';
import { assertIsTransformationMatrix } from '@/geometry/transformation-matrix';
import { decomposeMatrix } from '@/geometry/decomposed-transformation-matrix';

@GraphNodeType('Geometry', 'Transform', 'Decompose')
export class Decompose extends GraphNode {
  private input;

  private outputTranslation;
  private outputRotation;
  private outputScale;
  private outputSkew;

  constructor(modelId: string) {
    super(modelId);

    this.input = this.registerObjectInput('Transformation Matrix').validate(
      assertIsTransformationMatrix
    );

    this.outputTranslation = this.registerObjectOutput<XY>('Translation');
    this.outputRotation = this.registerNumberOutput('Rotation');
    this.outputScale = this.registerObjectOutput<XY>('Scale');
    this.outputSkew = this.registerObjectOutput<XY>('Skew');
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [matrix] of inputIterators.cycleValues(this.input)) {
      const { translation, rotation, scale, skew } = decomposeMatrix(matrix);

      this.outputTranslation.next(translation);
      this.outputRotation.next(rotation);
      this.outputScale.next(scale);
      this.outputSkew.next(skew);
    }
  }
}
