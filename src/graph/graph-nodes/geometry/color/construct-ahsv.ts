import type { ColorARGB } from '@/geometry/color';
import { GraphNode } from '../../../core/graph-node';
import { GraphNodeType } from '../../decorators';
import { toColorRGB } from '@/geometry/color-hsv';
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';

@GraphNodeType('Geometry', 'Color', 'Construct AHSV')
export class ConstructAHSV extends GraphNode {
  private input1;
  private input2;
  private input3;
  private input4;
  private output;

  constructor(modelId: string) {
    super(modelId);

    this.input1 = this.registerNumberInput('Alpha');
    this.input2 = this.registerNumberInput('Hue');
    this.input3 = this.registerNumberInput('Saturation');
    this.input4 = this.registerNumberInput('Brightness');
    this.output = this.registerObjectOutput<ColorARGB>('Color');
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [a, h, s, v] of inputIterators.cycleValues(
      this.input1,
      this.input2,
      this.input3,
      this.input4,
    )) {
      const r = { a, ...toColorRGB({ h, s, v }) };
      this.output.next(r);
    }
  }
}
