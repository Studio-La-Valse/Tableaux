import type { Text as _Text } from '@/geometry/text/text'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { assertIsXY } from '@/geometry/primitives/xy'
import { assertIsFont } from '@/geometry/text/font'
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
    this.outputText = this.registerObjectOutput<_Text>('Text')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [text, origin, fontFamily, fontSize] of inputIterators.cycleValues(
      this.inputText,
      this.inputOrigin,
      this.inputFontFamily,
      this.inputFontSize,
    )) {
      const v = { text, ...origin, fontFamily, fontSize }
      this.outputText.next(v)
    }
  }
}
