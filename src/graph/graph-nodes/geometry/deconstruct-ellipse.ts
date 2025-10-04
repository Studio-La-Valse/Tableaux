import { GraphNode } from '../../core/graph-node';
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';
import { GraphNodeType } from '../decorators';
import { type XY as xy } from '@/geometry/xy';
import { deconstruct as deconstructEllipse } from '@/geometry/ellipse';
import { assertIsShape, isOfShapeKind } from '@/geometry/shape';

@GraphNodeType('Geometry', 'Deconstruct Ellipse')
export class DeconstructEllipse extends GraphNode {
  private inputCircle;

  private outputOrigin;
  private outputRadiusX;
  private outputRadiusY;
  private outputRotation;
  private outputArea;
  private outputCircumference;

  constructor(id: string, path: string[]) {
    super(id, path);

    this.inputCircle = this.registerObjectInput('Circle').validate((v) => {
      const shape = assertIsShape(v);
      if (!isOfShapeKind(shape, ['circle', 'ellipse'])) {
        throw new Error(
          `Unknown geometry type, expected 'circle' or 'ellipse', got ${shape.kind}`
        );
      }
      return shape;
    });

    this.outputOrigin = this.registerObjectOutput<xy>('Origin');
    this.outputRadiusX = this.registerNumberOutput('Radius X');
    this.outputRadiusY = this.registerNumberOutput('Radius Y');
    this.outputRotation = this.registerNumberOutput('Rotation');
    this.outputArea = this.registerNumberOutput('Area');
    this.outputCircumference = this.registerNumberOutput('Circumference');
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [shape] of inputIterators.cycleValues(this.inputCircle)) {
      const { origin, radiusX, radiusY, rotation, area, circumference } =
        deconstructEllipse(shape);

      this.outputOrigin.next(origin);
      this.outputRadiusX.next(radiusX);
      this.outputRadiusY.next(radiusY);
      this.outputRotation.next(rotation);
      this.outputArea.next(area);
      this.outputCircumference.next(circumference);
    }
  }
}
