import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async';
import { GraphNode } from '../../core/graph-node';
import { GraphNodeType } from '../decorators';

@GraphNodeType('Canvas', 'Key Press')
export class KeyPress extends GraphNode {
  private output;
  private active;

  public override data: { values: string[]; active: boolean } = {
    values: [],
    active: true,
  };

  constructor(id: string, path: string[]) {
    super(id, path);

    this.output = this.registerStringOutput('Key');
    this.active = this.registerBooleanInput('Active');
  }

  public keyDown(newValue: string): void {
    this.data.values.push(newValue);

    if (this.data.active) {
      this.arm();
      this.complete();
    }
  }

  public keyUp(newValue: string): void {
    const index = this.data.values.findIndex((v) => v == newValue);
    if (index == -1) {
      return;
    }

    this.data.values.splice(index, 1);
    if (this.data.active) {
      this.arm();
      this.complete();
    }
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    const [setActive] = inputIterators.singletonOnly(this.active);
    this.data.active = setActive;

    if (!setActive) {
      this.data.values.length = 0;
      return;
    }
    if (!this.data.values) return;

    for (const value of this.data.values) {
      this.output.next(value);
    }
  }
}
