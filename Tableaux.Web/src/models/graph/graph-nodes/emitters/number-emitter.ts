import { GraphNode } from '../../core/graph-node'
import type { GraphNodeOutputType } from '../../core/graph-node-output';

export class NumberEmitter extends GraphNode {
  private readonly output: GraphNodeOutputType<number>;

  public value: number = 0

  constructor(id: string, path: string[]) {
    super(id, path)

    this.output = this.registerNumberOutput("Number");
  }

  override onInitialize(): void {
    this.solve();
  }

  public onChange(newValue: number): void {
    this.arm()
    this.value = newValue
    this.complete()
  }

  protected solve(): void {
    this.output.next(this.value)
  }
}

