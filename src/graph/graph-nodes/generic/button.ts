import { Emitter, type EmitterKind } from '@/graph/core/emitter';
import { GraphNodePanel, GraphNodeType } from '../decorators';
import ButtonPanel from '@/components/graph/Panels/ButtonPanel.vue';

@GraphNodeType('Generic', 'Button')
@GraphNodePanel(ButtonPanel)
export class Button extends Emitter<boolean> {
  private output;

  override type: EmitterKind = 'button';

  constructor(id: string, path: string[]) {
    super(id, path, false);

    this.output = this.registerBooleanOutput('Value');
  }

  protected async solve(): Promise<void> {
    this.output.next(this.data.value);
  }
}
