import { assertIsColorARGB } from '@/geometry/color-rgb';
import { GraphNode } from '../../core/graph-node';
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';
import { GraphNodeType } from '../decorators';
import { assertIsShape, type Shape } from '@/geometry/shape';
import type { Stroke } from '@/bitmap-painters/stroke';

@GraphNodeType('Canvas', 'Set Stroke')
export class SetStroke extends GraphNode {
  private inputGeometry;
  private color;
  private strokeWidth;

  private outputGeometry;

  constructor(id: string, path: string[]) {
    super(id, path);

    this.inputGeometry =
      this.registerObjectInput('Geometry').validate(assertIsShape);
    this.color = this.registerObjectInput('Color').validate(assertIsColorARGB);
    this.strokeWidth = this.registerNumberInput('Stroke Width');

    this.outputGeometry = this.registerObjectOutput<Shape & Stroke>(
      'Geometry with stroke'
    );
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [geom, stroke, strokeWidth] of inputIterators.cycleValues(
      this.inputGeometry,
      this.color,
      this.strokeWidth
    )) {
      const withStroke = {
        ...geom,
        stroke,
        strokeWidth,
      };
      this.outputGeometry.next(withStroke);
    }
  }
}
