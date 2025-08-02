import { GraphNode } from "@/graph/core/graph-node";
import { inputIterators } from "@/graph/core/input-iterators";
import Perlin from '@/noise/perlin'
import { GraphNodeType } from "../../decorators";

@GraphNodeType("Math", "Noise", "Simplex 3d")
export class Simplex3d extends GraphNode {
  private input1
  private input2
  private input3
  private inputScale

  private output

  private perlin

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input1 = this.registerNumberInput("X")
    this.input2 = this.registerNumberInput("Y")
    this.input3 = this.registerNumberInput("Z")
    this.inputScale = this.registerNumberInput("Scale")
    this.output = this.registerNumberOutput("Value")
    this.perlin = new Perlin()
  }

  protected solve(): void {
    inputIterators
      .cycleValues(this.input1, this.input2, this.input3, this.inputScale)
      .map(([x, y, z, scale]) => this.perlin.simplex3(x / scale, y / scale, z / scale))
      .forEach((v) => this.output.next(v))
  }

}

