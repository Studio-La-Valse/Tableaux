import type { XY } from '@/models/geometry/xy'
import type { GraphNode } from './graph-node'
import type { GraphNodeModel } from './models/graph-node-model'

export class GraphNodeWrapper {
  private _height = 30
  private _width = 100
  private _handlePadStartStop = 20
  private _handlePad = 30
  public version

  public xy: XY = { x: 0, y: 0}

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
    const totalHandles = Math.max(this.innerNode.numberOfInputs, this.innerNode.numberOfOutputs, 1)
    if (totalHandles === 1) {
      return this._handlePadStartStop * 2 // just top and bottom padding
    }

    const usableHandleArea = (totalHandles - 1) * this._handlePad
    return usableHandleArea + this._handlePadStartStop * 2
  }

  public get minWidth(): number {
    return 100
  }

  constructor(public readonly innerNode: GraphNode) {
    this.version = crypto.randomUUID()
  }

  public toModel(): GraphNodeModel {
    const result = {
      id: this.innerNode.id,
      path: this.innerNode.path,
      x: this.xy.x,
      y: this.xy.y,
      ...(Object.keys(this.innerNode.data).length > 0 && { data: this.innerNode.data }),
      ...(this.width !== this.minWidth && { width: this.width }),
      ...(this.height !== this.minHeight && { height: this.height }),
    }
    return result
  }

  /**
   * Returns Y-coordinate for a connector handle relative to node top.
   */
  public calculateHandleHeight(index: number, of: number): number {
    if (of === 1) {
      // If there's only one handle, position it at the center
      return this.height / 2
    }

    const usableHeight = this.height - 2 * this._handlePadStartStop
    const spacing = usableHeight / (of - 1)
    return this._handlePadStartStop + index * spacing
  }

  /**
   * Returns absolute Y-coordinate for a connector handle.
   */
  public calculateHandleCoordinate(index: number, of: number): number {
    const height = this.calculateHandleHeight(index, of)
    return this.xy.y + height
  }
}
