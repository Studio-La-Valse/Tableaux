import { GraphNode } from "@/graph/core/graph-node";
import { inputIterators } from "@/graph/core/input-iterators";
import Perlin from '@/noise/perlin'
import { GraphNodeType } from "../../decorators";

@GraphNodeType("Math", "Noise", "Perlin 3d")
export class Perlin3d extends GraphNode {
  private input1
  private input2
  private input3
  private inputTime
  private inputScale

  private output

  private perlin

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input1 = this.registerNumberInput("X")
    this.input2 = this.registerNumberInput("Y")
    this.input3 = this.registerNumberInput("Z")
    this.inputTime = this.registerNumberInput("Time")
    this.inputScale = this.registerNumberInput("Scale")
    this.output = this.registerNumberOutput("Value")
    this.perlin = new Perlin()
  }

  protected solve(): void {
    inputIterators
      .cycleValues(this.input1, this.input2, this.input3, this.inputTime, this.inputScale)
      .map(([x, y, z, time, scale]) => this.perlin.perlin3((x + time) / scale, (y + time) / scale, (z + time) / scale))
      .forEach((v) => this.output.next(v))
  }

}

