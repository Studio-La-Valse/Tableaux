import { GraphNode } from '@/graph/core/graph-node';
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';
import { GraphNodeType } from '../../decorators';
import { assertIsEllipticalArcShape } from '@/geometry/elliptical-arc';
import { assertIsShape } from '@/geometry/shape';

@GraphNodeType('Geometry', 'Curve', 'Deconstruct Elliptical Arc')
export class DeconstructEllipticalArc extends GraphNode {
  private input;
  private outputCenter;
  private outputRadiusX;
  private outputRadiusY;
  private outputRotation;
  private outputStartAngle;
  private outputEndAngle;
  private outputCounterClockwise;

  constructor(id: string, path: string[]) {
    super(id, path);

    this.input = this.registerObjectInput('Elliptical Arc').validate((v) =>
      assertIsEllipticalArcShape(assertIsShape(v))
    );

    this.outputCenter = this.registerObjectOutput('Center');
    this.outputRadiusX = this.registerNumberOutput('Radius X');
    this.outputRadiusY = this.registerNumberOutput('Radius Y');
    this.outputRotation = this.registerNumberOutput('Rotation');
    this.outputStartAngle = this.registerNumberOutput('Start Angle');
    this.outputEndAngle = this.registerNumberOutput('End Angle');
    this.outputCounterClockwise = this.registerBooleanOutput('Counter Clockwise');
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const arc of inputIterators.createGenerator(this.input)) {
      const { x, y, radiusX, radiusY, rotation, startAngle, endAngle, counterclockwise } = arc;

      this.outputCenter.next({ x, y });
      this.outputRadiusX.next(radiusX);
      this.outputRadiusY.next(radiusY);
      this.outputRotation.next(rotation);
      this.outputStartAngle.next(startAngle);
      this.outputEndAngle.next(endAngle);
      this.outputCounterClockwise.next(counterclockwise);
    }
  }
}
