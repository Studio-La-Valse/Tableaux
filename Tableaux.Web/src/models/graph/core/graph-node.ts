import { GraphNodeInput } from './graph-node-input'
import { GraphNodeOutput } from './graph-node-output'

export abstract class GraphNode {
  public abstract path: string[]
  public id: string

  private _height = 50;
  private _width = 150;
  public get height(){
    return Math.max(this._height, this.computedMinHeight)
  }
  public set height(val: number){
    const value = Math.max(val, this.computedMinHeight)
    this._height = value;
  }
  public get width(){
    return Math.max(this._width, this.minWidth)
  }
  public set width(val: number){
    const value = Math.max(val, this.minWidth)
    this._width = value;
  }

  public x: number = 0
  public y: number = 0

  public get computedMinHeight() { return Math.max(this.numberOfInputs, this.numberOfOutputs, 1) * 50 };
  public get minWidth() { return 150; }

  constructor() {
    this.id = crypto.randomUUID()
  }

  public onInitialize(): void {

  }

  public trySubscribeSelf(): void {
    this.outputs.forEach((output) => {
      output.trySubscribe(this.id)
    })
  }

  public trySubscribeParent(graphNodeId: string) {
    if (graphNodeId == this.id) {
      const msg = `Circular subscription detected for graph node ${graphNodeId}.`
      throw new Error(msg)
    }

    this.outputs.forEach((output) => {
      output.trySubscribe(graphNodeId)
    })
  }

  public arm(): void {
    this.outputs.forEach(e => e.arm())
  }

  public abstract complete(): void

  public abstract inputs: GraphNodeInput[]

  public get numberOfInputs(): number {
    return this.inputs.length
  }

  public inputAt(index: number): GraphNodeInput {
    return this.inputs[index]
  }

  public abstract outputs: GraphNodeOutput[]

  public get numberOfOutputs(): number {
    return this.outputs.length
  }

  public outputAt(index: number): GraphNodeOutput {
    return this.outputs[index]
  }

  public calculateHandleFactor(index: number, of: number){
    if (index > of){
      const msg = `The index ${index} cannot be great than of ${of}`
      throw new Error(msg)
    }

    const parts = of + 1;
    const slices = 1 / parts;
    const factor = slices * (index + 1);
    return factor;
  }

  public calculateHandleHeight(index: number, of: number){
    const factor = this.calculateHandleFactor(index, of);
    const height = factor * this.height;
    return height;
  }

  public calculateHandleCoordinate(index: number, of: number){
    const height = this.calculateHandleHeight(index, of);
    const coordinate = this.y + height;
    return coordinate;
  }
}
