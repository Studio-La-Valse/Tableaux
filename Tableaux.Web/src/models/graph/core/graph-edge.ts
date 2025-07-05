import type { GraphEdgeModel } from "./models/graph-edge-model"

export class GraphEdge {
  constructor(
    public leftGraphNodeId: string,
    public outputIndex: number,
    public rightGraphNodeId: string,
    public inputIndex: number,
  ) {}

  public createKey(): string {
    const key = `${this.leftGraphNodeId}-${this.outputIndex}-${this.rightGraphNodeId}-${this.inputIndex}`
    return key
  }

  public toModel(): GraphEdgeModel {
    return {
      leftGraphNodeId: this.leftGraphNodeId,
      outputIndex: this.outputIndex,
      rightGraphNodeId: this.rightGraphNodeId,
      inputIndex: this.inputIndex
    }
  }
}
