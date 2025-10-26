import { GraphNode } from '../../core/graph-node';
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';
import { GraphNodeType } from '../decorators';
import {
  textAlignments,
  textBaselines,
  textDirections,
  type AlignmentKind,
  type BaselineKind,
  type DirectionKind,
  type TextShape,
} from '@/geometry/text';
import { assertIsOfShapeKind, asShape } from '@/geometry/shape';

@GraphNodeType('Canvas', 'Set Text Format')
export class SetTextFormat extends GraphNode {
  private asConst;

  private outputGeometry;

  constructor(id: string, path: string[]) {
    super(id, path);

    this.asConst = [
      this.registerObjectInput('Text').validate((v) => assertIsOfShapeKind(asShape(v), ['text'])),
      this.registerStringInput('Alignment', ['start']),
      this.registerStringInput('Baseline', ['alphabetic']),
      this.registerStringInput('Direction', ['inherit']),
    ] as const;

    this.outputGeometry = this.registerObjectOutput<TextShape>('Geometry with stroke');
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [text, alignment, baseline, direction] of inputIterators.cycleValues(
      ...this.asConst
    )) {
      if (!textAlignments.includes(alignment as AlignmentKind)) {
        throw new Error('Provided alignment is not valid.');
      }

      if (!textBaselines.includes(baseline as BaselineKind)) {
        throw new Error('Provided baseline is not valid.');
      }

      if (!textDirections.includes(direction as DirectionKind)) {
        throw new Error('Provided direction is not valid.');
      }

      const withFormat = {
        ...text,
        align: alignment as AlignmentKind,
        baseline: baseline as BaselineKind,
        direction: direction as DirectionKind,
      };

      this.outputGeometry.next(withFormat);
    }
  }
}
