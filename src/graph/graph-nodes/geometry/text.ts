import { GraphNode } from '@/graph/core/graph-node'
import { GraphNodeType } from '../decorators'
import { createText, type TextShape } from '@/geometry/text-shape'
import { inputIterators } from '@/graph/core/input-iterators'
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
  protected solve(): void {
    inputIterators
      .cycleValues(this.inputText, this.inputOrigin, this.inputFontFamily, this.inputFontSize)
      .map(([t, o, ff, fs]) => createText(t, assertIsXY(o), ff, fs))
      .forEach((v) => this.outputText.next(v))
  }
}
