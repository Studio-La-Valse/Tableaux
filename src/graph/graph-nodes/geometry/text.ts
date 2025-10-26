import { GraphNode } from '@/graph/core/graph-node';
import { GraphNodeType } from '../decorators';
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';
import { assertIsXY } from '@/geometry/xy';
import { assertIsFont } from '@/geometry/font';
import { createText, type TextShape } from '@/geometry/text';

@GraphNodeType('Geometry', 'Text')
export class Text extends GraphNode {
  private inputText;
  private inputOrigin;
  private inputFontFamily;
  private inputFontSize;
  private outputText;

  constructor(id: string, path: string[]) {
    super(id, path);

    this.inputText = this.registerStringInput('Text');
    this.inputOrigin = this.registerObjectInput('Origin').validate(assertIsXY);
    this.inputFontFamily = this.registerObjectInput('Family').validate(assertIsFont);
    this.inputFontSize = this.registerNumberInput('Size');
    this.outputText = this.registerObjectOutput<TextShape>('Text');
  }
  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [t, o, ff, si] of inputIterators.cycleValues(
      this.inputText,
      this.inputOrigin,
      this.inputFontFamily,
      this.inputFontSize
    )) {
      const v = createText(t, o, ff, si);
      this.outputText.next(v);
    }
  }
}
