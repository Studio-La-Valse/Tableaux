import type { ColorARGB } from '@/geometry/color';
import { GraphNode } from '../../../core/graph-node';
import { GraphNodeType } from '../../decorators';
import { isValidHexColor, toColorARGB } from '@/geometry/color-hex';
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';

@GraphNodeType('Geometry', 'Color', 'Hex To Color')
export class HexToColor extends GraphNode {
  private input1;
  private output;

  constructor(id: string, path: string[]) {
    super(id, path);

    this.input1 = this.registerStringInput('Hex');
    this.output = this.registerObjectOutput<ColorARGB>('Color');
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [hex] of inputIterators.cycleValues(this.input1)) {
      if (!isValidHexColor(hex)) throw new Error('Excpected valid hex format.');
      this.output.next(toColorARGB(hex));
    }
  }
}
