import { GraphNode } from '../../core/graph-node'
import type { GraphNodeOutputType } from '../../core/graph-node-output';

export class NumberEmitter extends GraphNode {
  private readonly output: GraphNodeOutputType<number>;

  constructor(id: string, path: string[]) {
    super(id, path)

    this.output = this.registerNumberOutput("Number");
    this.data = {
      value: 0
    }
  }

  override onInitialize(): void {
    this.solve();
  }

  public onChange(newValue: number): void {
    this.arm()
    this.data.value = newValue
    this.complete()
  }

  protected solve(): void {
    this.output.next(this.data.value as number)
  }
}

