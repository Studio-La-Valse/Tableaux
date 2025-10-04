import { GraphNode } from "@/graph/core/graph-node";
import type { InputIteratorsAsync } from "@/graph/core/input-iterators-async";

export class Default extends GraphNode {
  private in
  private default
  private out

  constructor(id: string, path: string[]) {
    super(id, path)

    this.in = this.registerUnkownInput("Input")
    this.default = this.registerUnkownInput("Default Value")
    this.out = this.registerUnkownOutput("Output")
  }

  protected override async solve(iterators: InputIteratorsAsync): Promise<void> {
    const length = this.in.payloadLength
    let payload = this.in
    
    if (length === 0) {
      const defaultLength = this.default.payloadLength
      if (defaultLength === 0) {
        throw Error("Both the input and the default are empty")
      }

      payload = this.default
    }

    for await (const value of iterators.createGenerator(payload)) {
      this.out.next(value)
    }
  }
}
