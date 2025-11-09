import type { GraphNodeInputType } from '../../core/graph-node-input';
import { GraphNode } from '../../core/graph-node';
import { reactive } from 'vue';
import { GraphNodePanel, GraphNodeType } from '../decorators';
import LoggerPanel from '@/components/graph/Panels/LoggerPanel.vue';
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';

@GraphNodeType('Generic', 'Logger')
@GraphNodePanel(LoggerPanel)
export class Logger extends GraphNode {
  private input: GraphNodeInputType<string>;

  public readonly values = reactive<string[]>([]);

  constructor(modelId: string) {
    super(modelId);

    this.input = this.registerStringInput('Values');
  }

  public arm(): void {
    this.values.length = 0;
    super.arm();
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    this.values.length = 0;

    for await (const [e] of inputIterators.cycleValues(this.input)) {
      this.values.push(e);
    }
  }
}
