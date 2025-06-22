import { GraphNode } from "../../core/graph-node";
import type { GraphNodeOutputType } from "../../core/graph-node-output";

export class TextEmitter extends GraphNode {
  private output: GraphNodeOutputType<string>;

  public value: string = "Hello, world!";

  constructor(id: string, path: string[]) {
    super(id, path)

    this.output = this.registerTextOutput();
  }

  override onInitialize(): void {
    this.solve();
  }

  public onChange(newValue: string): void {
    this.arm()
    this.value = newValue
    this.complete()
  }

  protected solve(): void {
    this.output.next(this.value)
  }
}
