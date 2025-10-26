import { GraphNode } from '../../core/graph-node';
import { GraphNodeType } from '../decorators';
import { assertIsOfShapeKind, asShape } from '@/geometry/shape';
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';
import type { Rectangle } from '@/geometry/rectangle';

@GraphNodeType('Canvas', 'Round Corners')
export class RoundCorners extends GraphNode {
  private inputGeometry;
  private topLeft;
  private topRight;
  private bottomRight;
  private bottomLeft;

  private outputGeometry;

  constructor(id: string, path: string[]) {
    super(id, path);

    this.inputGeometry = this.registerObjectInput('Geometry').validate((v) =>
      assertIsOfShapeKind(asShape(v), ['rectangle'])
    );
    this.topLeft = this.registerNumberInput('Top Left');
    this.topRight = this.registerNumberInput('Top Right');
    this.bottomRight = this.registerNumberInput('Bottom Right');
    this.bottomLeft = this.registerNumberInput('Bottom Left');

    this.outputGeometry = this.registerObjectOutput<Rectangle>('Geometry with Round Corners');
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [
      geom,
      topLeft,
      topRight,
      bottomRight,
      bottomLeft,
    ] of inputIterators.cycleValues(
      this.inputGeometry,
      this.topLeft,
      this.topRight,
      this.bottomRight,
      this.bottomLeft
    )) {
      const withFill = {
        ...geom,
        radii: [topLeft, topRight, bottomRight, bottomLeft],
      };
      this.outputGeometry.next(withFill);
    }
  }
}
