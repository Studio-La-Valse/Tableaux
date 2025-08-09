import { GraphNode } from '../../core/graph-node'
import { inputIterators } from '../../core/input-iterators'
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
  private inputText
  private inputAlignment
  private inputBaseline
  private inputDirection

  private outputGeometry

  constructor(id: string, path: string[]) {
    super(id, path)

    this.inputText = this.registerObjectInput('Text')
    this.inputAlignment = this.registerStringInput('Alignment')
    this.inputBaseline = this.registerStringInput('Baseline')
    this.inputDirection = this.registerStringInput('Direction')

    this.outputGeometry = this.registerObjectOutput<TextShape & Partial<TextFormatOptions>>(
      'Geometry with stroke',
    )
  }

  protected solve(): void {
    inputIterators
      .cycleValues(this.inputText, this.inputAlignment, this.inputBaseline, this.inputDirection)
      .forEach(([text, alignment, baseline, direction]) => {
        const geom = assertIsTextShape(text)

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
          ...geom,
          align: alignment as AlignmentKind,
          baseline: baseline as BaselineKind,
          direction: direction as DirectionKind,
        }

        this.outputGeometry.next(withFormat)
      })
  }
}
