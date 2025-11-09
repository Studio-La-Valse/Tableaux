import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';
import { GraphNode } from '../../../core/graph-node';
import { GraphNodeType } from '../../decorators';
import { assertIsColorARGB, toColorHSV } from '@/geometry/color-rgb';

@GraphNodeType('Geometry', 'Color', 'Deconstruct AHSV')
export class DeconstructAHSV extends GraphNode {
  private input;
  private output1;
  private output2;
  private output3;
  private output4;

  constructor(modelId: string) {
    super(modelId);

    this.input = this.registerObjectInput('Color').validate(assertIsColorARGB);

    this.output1 = this.registerNumberOutput('Alpha');
    this.output2 = this.registerNumberOutput('Hue');
    this.output3 = this.registerNumberOutput('Saturation');
    this.output4 = this.registerNumberOutput('Brightness');
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [argb] of inputIterators.cycleValues(this.input)) {
      const hsl = toColorHSV(argb);
      this.output1.next(argb.a);
      this.output2.next(hsl.h);
      this.output3.next(hsl.s);
      this.output4.next(hsl.v);
    }
  }
}
