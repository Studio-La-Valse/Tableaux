import { Emitter, type EmitterKind } from '@/graph/core/emitter';
import { GraphNodePanel, GraphNodeType } from '../decorators';
import SliderPanel from '@/components/graph/Panels/SliderPanel.vue';

@GraphNodeType('Math', 'Slider')
@GraphNodePanel(SliderPanel)
export class Slider extends Emitter<number> {
  public type: EmitterKind = 'range';

  private output;

  constructor(id: string, path: string[]) {
    super(id, path, 0);

    this.output = this.registerNumberOutput('Value');
  }

  protected async solve(): Promise<void> {
    this.output.next(this.data.value);
  }
}
