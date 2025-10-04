import { GraphNode } from '../../core/graph-node';
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';
import { GraphNodeType } from '../decorators';
import { type XY as xy } from '@/geometry/xy';
import { deconstruct as deconstructRectangle } from '@/geometry/rectangle';
import { assertIsShape, isOfShapeKind } from '@/geometry/shape';

@GraphNodeType('Geometry', 'Deconstruct Rectangle')
export class DeconstructRectangle extends GraphNode {
  private inputShape;

  private topLeft;
  private topRight;
  private bottomRight;
  private bottomLeft;
  private center;
  private width;
  private height;
  private rotation;
  private area;
  private perimeter;
  private diagonal;

  constructor(id: string, path: string[]) {
    super(id, path);

    this.inputShape = this.registerObjectInput('Shape').validate((v) => {
      const geom = assertIsShape(v);

      if (!isOfShapeKind(geom, ['rectangle', 'square'])) {
        throw new Error(
          `Unsupported shape kind, expected 'rectangle' or 'square', got: ${geom.kind}`
        );
      }
      return geom;
    });

    this.topLeft = this.registerObjectOutput<xy>('Top Left');
    this.topRight = this.registerObjectOutput<xy>('Top Right');
    this.bottomRight = this.registerObjectOutput<xy>('Bottom Right');
    this.bottomLeft = this.registerObjectOutput<xy>('Bottom Left');
    this.center = this.registerObjectOutput<xy>('Center');
    this.width = this.registerNumberOutput('Width');
    this.height = this.registerNumberOutput('Height');
    this.rotation = this.registerNumberOutput('Rotation');
    this.area = this.registerNumberOutput('Area');
    this.perimeter = this.registerNumberOutput('Perimeter');
    this.diagonal = this.registerNumberOutput('Diagnoal');
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [geom] of inputIterators.cycleValues(this.inputShape)) {
      const {
        topLeft,
        topRight,
        bottomRight,
        bottomLeft,
        center,
        width,
        height,
        rotation,
        area,
        perimeter,
        diagonal,
      } = deconstructRectangle(geom);

      this.topLeft.next(topLeft);
      this.topRight.next(topRight);
      this.bottomRight.next(bottomRight);
      this.bottomLeft.next(bottomLeft);
      this.center.next(center);
      this.width.next(width);
      this.height.next(height);
      this.rotation.next(rotation);
      this.area.next(area);
      this.perimeter.next(perimeter);
      this.diagonal.next(diagonal);
    }
  }
}
