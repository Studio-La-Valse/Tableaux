import { GraphNode } from '../../core/graph-node';
import { GraphNodeType } from '../decorators';
import { asShape, type Shape } from '@/geometry/shape';
import type { Fill } from '@/geometry/fill';
import { assertIsColorARGB } from '@/geometry/color-rgb';
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';

@GraphNodeType('Canvas', 'Set Fill')
export class SetFill extends GraphNode {
  private inputGeometry;
  private color;

  private outputGeometry;

  constructor(modelId: string) {
    super(modelId);

    this.inputGeometry = this.registerObjectInput('Geometry').validate(asShape);
    this.color = this.registerObjectInput('Color').validate(assertIsColorARGB);

    this.outputGeometry = this.registerObjectOutput<Shape & Fill>('Geometry with fill');
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [geom, fill] of inputIterators.cycleValues(this.inputGeometry, this.color)) {
      const withFill = {
        ...geom,
        fill,
      };
      this.outputGeometry.next(withFill);
    }
  }
}
