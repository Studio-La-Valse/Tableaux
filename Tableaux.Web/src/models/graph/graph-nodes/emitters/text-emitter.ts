import { GraphNode } from "../../core/graph-node";
import type { GraphNodeOutputType } from "../../core/graph-node-output";

export class TextEmitter extends GraphNode {
  private output: GraphNodeOutputType<string>;

  constructor(id: string, path: string[]) {
    super(id, path)

    this.output = this.registerTextOutput("Text");
    this.data.value = "Hello, world!"
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
