import type { TextShape } from '@/geometry/text/text'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { assertIsXY } from '@/geometry/primitives/xy'
import { assertIsFont } from '@/geometry/text/font'
import { createText } from '@/geometry/text/text'
import { GraphNode } from '@/graph/core/graph-node'
import { GraphNodeType } from '../decorators'

@GraphNodeType('Geometry', 'Text')
export class Text extends GraphNode {
  private inputText
  private inputOrigin
  private inputFontFamily
  private inputFontSize
  private outputText

  constructor(modelId: string) {
    super(modelId)

    this.inputText = this.registerStringInput('Text')
    this.inputOrigin = this.registerObjectInput('Origin').validate(assertIsXY)
    this.inputFontFamily = this.registerObjectInput('Family').validate(assertIsFont)
    this.inputFontSize = this.registerNumberInput('Size')
    this.outputText = this.registerObjectOutput<TextShape>('Text')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [t, o, ff, si] of inputIterators.cycleValues(
      this.inputText,
      this.inputOrigin,
      this.inputFontFamily,
      this.inputFontSize,
    )) {
      const v = createText(t, o, ff, si)
      this.outputText.next(v)
    }
  }
}
