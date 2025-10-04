import TextPanel from '@/components/graph/Panels/TextPanel.vue';
import type { GraphNodeOutputType } from '../../core/graph-node-output';
import { GraphNodePanel, GraphNodeType } from '../decorators';
import { Emitter } from '@/graph/core/emitter';

@GraphNodeType('Text', 'Text Emitter')
@GraphNodePanel(TextPanel)
export class TextEmitter extends Emitter<string> {
  public override type: 'number' | 'text' = 'text';

  private output: GraphNodeOutputType<string>;

  constructor(id: string, path: string[]) {
    super(id, path, 'Hello, world!');

    this.output = this.registerStringOutput('Text');
  }

  protected async solve(): Promise<void> {
    this.output.next(this.data.value);
  }
}
