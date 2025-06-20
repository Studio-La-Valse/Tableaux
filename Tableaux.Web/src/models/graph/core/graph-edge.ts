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
}
