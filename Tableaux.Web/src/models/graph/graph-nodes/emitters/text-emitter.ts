import { GraphNode } from "../../core/graph-node";
import type { GraphNodeOutputType } from "../../core/graph-node-output";
import type { JsonObject } from "../../core/models/json-object";

export class TextEmitter extends GraphNode {
  private output: GraphNodeOutputType<string>;

  constructor(id: string, path: string[], data: JsonObject) {
    super(id, path, data)

    this.output = this.registerTextOutput("Text");
    if (!this.data.value) this.data.value = "Hello, world!"
  }

  override onInitialize(): void {
    this.solve();
  }

  public onChange(newValue: string): void {
    this.arm()
    this.data.value = newValue
    this.complete()
  }

  protected solve(): void {
    (this.data.value as string).split('\n').forEach((v) => this.output.next(v))
  }
}
