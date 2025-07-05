import { GraphNode } from '../../core/graph-node'
import type { GraphNodeOutputType } from '../../core/graph-node-output';
import type { JsonObject } from '../../core/models/json-object';

export class NumberEmitter extends GraphNode {
  private readonly output: GraphNodeOutputType<number>;

  constructor(id: string, path: string[], data: JsonObject) {
    super(id, path, data)

    this.output = this.registerNumberOutput("Number");
    if (!data.value) data.value = 0
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

