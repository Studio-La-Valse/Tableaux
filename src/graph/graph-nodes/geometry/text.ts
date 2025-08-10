import { GraphNode } from '@/graph/core/graph-node'
import { GraphNodeType } from '../decorators'
import { createText, type TextShape } from '@/geometry/text-shape'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { assertIsXY } from '@/geometry/xy'

@GraphNodeType('Geometry', 'Text')
export class Text extends GraphNode {
  private inputText
  private inputOrigin
  private inputFontFamily
  private inputFontSize
  private outputText

  constructor(id: string, path: string[]) {
    super(id, path)

    this.inputText = this.registerStringInput('Text')
    this.inputOrigin = this.registerObjectInput('Origin')
    this.inputFontFamily = this.registerStringInput('Font Family')
    this.inputFontSize = this.registerNumberInput('Font Size')
    this.outputText = this.registerObjectOutput<TextShape>('Text')
  }
  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [t, o, ff, fs] of inputIterators.cycleValues(
      this.inputText,
      this.inputOrigin,
      this.inputFontFamily,
      this.inputFontSize,
    )) {
      const v = createText(t, assertIsXY(o), ff, fs)
      this.outputText.next(v)
    }
  }
}
