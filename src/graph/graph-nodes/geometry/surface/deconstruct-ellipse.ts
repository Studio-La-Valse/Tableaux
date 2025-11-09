import { GraphNode } from '../../../core/graph-node';
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';
import { GraphNodeType } from '../../decorators';
import { asEllipse } from '@/geometry/ellipse';

@GraphNodeType('Geometry', 'Surface', 'Deconstruct Ellipse')
export class DeconstructEllipse extends GraphNode {
  private input;
  private outputCenter;
  private outputRadiusX;
  private outputRadiusY;
  private outputRotation;

  constructor(modelId: string) {
    super(modelId);

    this.input = this.registerObjectInput('Ellipse').validate(asEllipse);

    this.outputCenter = this.registerObjectOutput('Center');
    this.outputRadiusX = this.registerNumberOutput('Radius X');
    this.outputRadiusY = this.registerNumberOutput('Radius Y');
    this.outputRotation = this.registerNumberOutput('Rotation');
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [ellipse] of inputIterators.cycleValues(this.input)) {
      const { x, y, radiusX, radiusY, rotation } = ellipse;

      this.outputCenter.next({ x, y });
      this.outputRadiusX.next(radiusX);
      this.outputRadiusY.next(radiusY);
      this.outputRotation.next(rotation);
    }
  }
}
