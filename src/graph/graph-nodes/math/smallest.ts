import { GraphNode } from "@/graph/core/graph-node";
import { GraphNodeType } from "../decorators";
import type { InputIteratorsAsync } from "@/graph/core/input-iterators-async";

@GraphNodeType("Math", "Smallest")
export class Smallest extends GraphNode{

  private numbers
  private smallest

  constructor(id: string, path: string[]) {
    super(id, path)

    this.numbers = this.registerNumberInput("Numbers")
    this.smallest = this.registerNumberOutput("Smallest")

  }

  protected override async solve(iterators: InputIteratorsAsync): Promise<void> {
    let smallest
    for await (const v of iterators.createGenerator(this.numbers)){
      if (!smallest || v < smallest) {
        smallest = v
      }
    }

    if (!smallest) {
      throw Error("Sequence of numbers was empty")
    }

    this.smallest.next(smallest)
  }

}
