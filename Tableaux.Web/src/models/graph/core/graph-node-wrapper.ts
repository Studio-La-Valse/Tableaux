import type { GraphNode } from './graph-node'
import type { GraphNodeModel } from './models/graph-node-model'
import type { JsonObject } from './models/json-object'

export class GraphNodeWrapper {
  private _height = 30
  private _width = 100
  private _handlePad = 45

  public x: number = 0
  public y: number = 0

  public get height(): number {
    return Math.max(this._height, this.minHeight)
  }

  public set height(val: number) {
    this._height = Math.max(val, this.minHeight)
  }

  public get width(): number {
    return Math.max(this._width, this.minWidth)
  }

  public set width(val: number) {
    this._width = Math.max(val, this.minWidth)
  }

  public get minHeight(): number {
    return (
      Math.max(this.innerNode.numberOfInputs, this.innerNode.numberOfOutputs, 1) * this._handlePad
    )
  }

  public get minWidth(): number {
    return 100
  }

  public get data() {
    return this.innerNode.data
  }

  public set data(val: JsonObject) {
    this.innerNode.data = val
  }

  public get id() {
    return this.innerNode.id
  }

  public get path() {
    return this.innerNode.path
  }

  public get inputs() {
    return this.innerNode.inputs
  }

  public get outputs() {
    return this.innerNode.outputs
  }

  constructor(public readonly innerNode: GraphNode) {}

  public toModel(): GraphNodeModel {
    return {
      id: this.id,
      path: this.path,
      data: this.data,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    }
  }

  /**
   * Computes relative position factor of a connector handle.
   */
  public calculateHandleFactor(index: number, of: number): number {
    if (index > of) {
      throw new RangeError(`The index ${index} cannot be greater than 'of' value ${of}.`)
    }

    const parts = of + 1
    return (1 / parts) * (index + 1)
  }

  /**
   * Calculates vertical position of a handle within the node.
   */
  public calculateHandleHeight(index: number, of: number): number {
    const factor = this.calculateHandleFactor(index, of)
    return factor * this.height
  }

  /**
   * Returns absolute Y-coordinate for a connector handle.
   */
  public calculateHandleCoordinate(index: number, of: number): number {
    const height = this.calculateHandleHeight(index, of)
    return this.y + height
  }

  public arm() {
    return this.innerNode.arm()
  }

  public complete() {
    return this.innerNode.complete()
  }

  public onDestroy() {
    return this.innerNode.onDestroy()
  }
}
