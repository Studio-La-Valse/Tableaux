import { GraphNode } from "@/graph/core/graph-node";
import { inputIterators } from "@/graph/core/input-iterators";
import Perlin from '@/noise/perlin'
import { GraphNodeType } from "../../decorators";

@GraphNodeType("Math", "Noise", "Perlin 2d")
export class Perlin2d extends GraphNode {
  private input1
  private input2
  private inputTime
  private inputScale

  private output

  private perlin

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input1 = this.registerNumberInput("X")
    this.input2 = this.registerNumberInput("Y")
    this.inputTime = this.registerNumberInput("Time")
    this.inputScale = this.registerNumberInput("Scale")
    this.output = this.registerNumberOutput("Value")
    this.perlin = new Perlin()
  }

  protected solve(): void {
    inputIterators
      .cycleValues(this.input1, this.input2, this.inputTime, this.inputScale)
      .map(([x, y, time, scale]) => this.perlin.perlin2((x + time) / scale, (y + time) / scale))
      .forEach((v) => this.output.next(v))
  }

}
