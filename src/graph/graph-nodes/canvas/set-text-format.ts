import { GraphNode } from '../../core/graph-node'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { GraphNodeType } from '../decorators'
import { assertIsTextShape, type TextShape } from '@/geometry/text-shape'
import {
  textAlignments,
  textBaselines,
  textDirections,
  type AlignmentKind,
  type BaselineKind,
  type DirectionKind,
  type TextFormatOptions,
} from '@/geometry/text-format-options'

@GraphNodeType('Geometry', 'Set Text Format')
export class SetTextFormat extends GraphNode {
  private asConst

  private outputGeometry

  constructor(id: string, path: string[]) {
    super(id, path)

    this.asConst = [
      this.registerObjectInput('Text').validate(assertIsTextShape),
      this.registerStringInput('Alignment'),
      this.registerStringInput('Baseline'),
      this.registerStringInput('Direction'),
    ] as const

    this.outputGeometry = this.registerObjectOutput<TextShape & Partial<TextFormatOptions>>(
      'Geometry with stroke',
    )
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [text, alignment, baseline, direction] of inputIterators.cycleValues(
      ...this.asConst,
    )) {
      if (!textAlignments.includes(alignment as AlignmentKind)) {
        throw new Error('Provided alignment is not valid.')
      }

      if (!textBaselines.includes(baseline as BaselineKind)) {
        throw new Error('Provided baseline is not valid.')
      }

      if (!textDirections.includes(direction as DirectionKind)) {
        throw new Error('Provided direction is not valid.')
      }

      const withFormat = {
        ...text,
        align: alignment as AlignmentKind,
        baseline: baseline as BaselineKind,
        direction: direction as DirectionKind,
      }

      this.outputGeometry.next(withFormat)
    }
  }
}
