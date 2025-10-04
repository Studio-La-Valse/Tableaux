import { assertIsColorARGB } from '@/geometry/color-rgb';
import { GraphNode } from '../../core/graph-node';
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';
import { GraphNodeType } from '../decorators';
import { assertIsShape, type Shape } from '@/geometry/shape';
import { applyDropShadow, type DropShadow } from '@/bitmap-painters/filter';
import { assertIsXY } from '@/geometry/xy';

@GraphNodeType('Canvas', 'Set Drop Shadow')
export class SetDropShadow extends GraphNode {
  private inputGeometry;
  private inputOffset;
  private inputColor;
  private inputSize;

  private outputGeometry;

  constructor(id: string, path: string[]) {
    super(id, path);

    this.inputGeometry =
      this.registerObjectInput('Shape').validate(assertIsShape);
    this.inputOffset = this.registerObjectInput('Offset').validate(assertIsXY);
    this.inputColor =
      this.registerObjectInput('Color').validate(assertIsColorARGB);
    this.inputSize = this.registerNumberInput('Size');

    this.outputGeometry = this.registerObjectOutput<
      Shape & { dropShadow: DropShadow }
    >('Geometry with shadow');
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [geom, offset, color, size] of inputIterators.cycleValues(
      this.inputGeometry,
      this.inputOffset,
      this.inputColor,
      this.inputSize
    )) {
      const withStroke = applyDropShadow(geom, offset, color, size);
      this.outputGeometry.next(withStroke);
    }
  }
}
