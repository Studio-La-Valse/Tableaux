import { GraphNodeAlreadyInitializedError } from './errors/graph-node-already-initialized-error'
import {
  GraphNodeInput,
  GraphNodeInputBoolean,
  GraphNodeInputObject,
  GraphNodeInputString,
  GraphNodeInputType,
  GraphNodeInputUnkown,
} from './graph-node-input'
import { GraphNodeInputNumber } from './graph-node-input'
import {
  GraphNodeOutput,
  GraphNodeOutputBoolean,
  GraphNodeOutputNumber,
  GraphNodeOutputObject,
  GraphNodeOutputString,
  GraphNodeOutputType,
  GraphNodeOutputUnkown,
} from './graph-node-output'

export class SignalLengthsNotEqualError extends Error { }

export const componentStates = {
  armed: 'armed',
  calculating: 'calculating',
  error: 'error',
  complete: 'complete',
} as const

export type ComponentState = (typeof componentStates)[keyof typeof componentStates]

// Helper to extract the element‐type `T` from a GraphNodeInputsType<T>
type InputOf<O> =
  O extends GraphNodeInputType<infer U>
  ? U
  : never

export abstract class GraphNode {
  private initialized: boolean = false

  public componentState: ComponentState

  private _height = 50
  private _width = 150
  public get height() {
    return Math.max(this._height, this.minHeight)
  }
  public set height(val: number) {
    const value = Math.max(val, this.minHeight)
    this._height = value
  }
  public get width() {
    return Math.max(this._width, this.minWidth)
  }
  public set width(val: number) {
    const value = Math.max(val, this.minWidth)
    this._width = value
  }

  public x: number = 0
  public y: number = 0

  public get minHeight() {
    return Math.max(this.numberOfInputs, this.numberOfOutputs, 1) * 50
  }
  public get minWidth() {
    return 150
  }

  private _inputs: GraphNodeInput[] = []
  public get inputs(): GraphNodeInput[] {
    return [...this._inputs]
  }

  public get numberOfInputs(): number {
    return this.inputs.length
  }

  private _outputs: GraphNodeOutput[] = []
  public get outputs(): GraphNodeOutput[] {
    return [...this._outputs]
  }

  public get numberOfOutputs(): number {
    return this.outputs.length
  }

  constructor(
    public id: string,
    public path: string[],
  ) {
    this.componentState = 'armed'
  }

  public registerBooleanInput(): GraphNodeInputType<boolean> {
    if (this.initialized) {
      throw new GraphNodeAlreadyInitializedError()
    }
    const input = new GraphNodeInputBoolean(this, this.numberOfInputs)
    this._inputs.push(input)
    return input
  }

  public registerNumberInput(): GraphNodeInputType<number> {
    if (this.initialized) {
      throw new GraphNodeAlreadyInitializedError()
    }
    const input = new GraphNodeInputNumber(this, this.numberOfInputs)
    this._inputs.push(input)
    return input
  }

  public registerStringInput(): GraphNodeInputType<string> {
    if (this.initialized) {
      throw new GraphNodeAlreadyInitializedError()
    }
    const input = new GraphNodeInputString(this, this.numberOfInputs)
    this._inputs.push(input)
    return input
  }

  public registerObjectInput(): GraphNodeInputType<object> {
    if (this.initialized) {
      throw new GraphNodeAlreadyInitializedError()
    }
    const input = new GraphNodeInputObject(this, this.numberOfInputs)
    this._inputs.push(input)
    return input
  }

  public registerUnkownInput(): GraphNodeInputType<unknown> {
    if (this.initialized) {
      throw new GraphNodeAlreadyInitializedError()
    }
    const input = new GraphNodeInputUnkown(this, this.numberOfInputs)
    this._inputs.push(input)
    return input
  }

  public registerBooleanOutput(): GraphNodeOutputType<boolean> {
    if (this.initialized) {
      throw new GraphNodeAlreadyInitializedError()
    }
    const output = new GraphNodeOutputBoolean(this, this.numberOfOutputs)
    this._outputs.push(output)
    return output
  }

  public registerNumberOutput(): GraphNodeOutputType<number> {
    if (this.initialized) {
      throw new GraphNodeAlreadyInitializedError()
    }
    const output = new GraphNodeOutputNumber(this, this.numberOfOutputs)
    this._outputs.push(output)
    return output
  }

  public registerTextOutput(): GraphNodeOutputType<string> {
    if (this.initialized) {
      throw new GraphNodeAlreadyInitializedError()
    }
    const output = new GraphNodeOutputString(this, this.numberOfOutputs)
    this._outputs.push(output)
    return output
  }

  public registerObjectOutput(): GraphNodeOutputType<object> {
    if (this.initialized) {
      throw new GraphNodeAlreadyInitializedError()
    }
    const output = new GraphNodeOutputObject(this, this.numberOfOutputs)
    this._outputs.push(output)
    return output
  }

  public registerUnkownOutput(): GraphNodeOutputType<unknown> {
    if (this.initialized) {
      throw new GraphNodeAlreadyInitializedError()
    }
    const output = new GraphNodeOutputUnkown(this, this.numberOfOutputs)
    this._outputs.push(output)
    return output
  }

  public onInitialize(): void {
    this.initialized = true
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
    this.componentState = 'armed'
    this.outputs.forEach((e) => e.arm())
  }

  public complete(): void {
    try {
      for (const input of this.inputs) {
        if (input.armed) {
          return
        }
      }

      this.componentState = 'calculating'

      this.outputs.forEach((e) => {
        e.arm()
      })

      this.solve()

      this.componentState = 'complete'

      this.outputs.forEach((output) => {
        output.complete()
      })
    } catch (err) {
      console.error(err)
      this.componentState = 'error'
    } finally {
    }
  }

  public cycleInputsValues<Inputs extends GraphNodeInputType<any>[]>(
    ...inputs: Inputs
  ): Array<{ [K in keyof Inputs]: InputOf<Inputs[K]> }> {

    // if any payload is empty, we can’t form a full tuple → return []
    if (inputs.some(i => i.payload.length === 0)) {
      return []
    }

    const maxLen = Math.max(...inputs.map(i => i.payload.length))
    const result: Array<{ [K in keyof Inputs]: InputOf<Inputs[K]> }> = []

    for (let i = 0; i < maxLen; i++) {
      const row = inputs.map(node =>
        node.payload[i % node.payload.length]
      ) as { [K in keyof Inputs]: InputOf<Inputs[K]> }
      result.push(row)
    }

    return result
  }

  public cycleInputsMultiples<Inputs extends GraphNodeInputType<any>[]>(
    ...inputs: Inputs
  ): Array<{ [K in keyof Inputs]: InputOf<Inputs[K]> }> {
    const lengths = inputs.map(i => i.payload.length)
    const maxLen = Math.max(...lengths)

    // guard: no empty payloads, and every length must divide maxLen
    if (lengths.some(len => len === 0 || maxLen % len !== 0)) {
      throw new Error(
        `cycleInputsMultiples: found payload lengths=[${lengths.join(',')}]; ` +
        `all must be >0 and divide the maximum (${maxLen})`
      )
    }

    const result: Array<{ [K in keyof Inputs]: InputOf<Inputs[K]> }> = []
    for (let i = 0; i < maxLen; i++) {
      // pick the i-th element for each payload, cycling shorter ones
      const row = inputs.map(node =>
        node.payload[i % node.payload.length]
      ) as { [K in keyof Inputs]: InputOf<Inputs[K]> }

      result.push(row)
    }

    return result
  }

  public cycleInputsFillLast<Inputs extends GraphNodeInputType<any>[]>(
    ...inputs: Inputs
  ): Array<{ [K in keyof Inputs]: InputOf<Inputs[K]> }> {
    const lengths = inputs.map(i => i.payload.length)
    const maxLen = Math.max(...lengths)

    // guard: no empty payloads
    if (lengths.some(len => len === 0)) {
      throw new Error(
        `cycleInputsFillLast: all payloads must be non-empty; got lengths=[${lengths.join(',')}]`
      )
    }

    const result: Array<{ [K in keyof Inputs]: InputOf<Inputs[K]> }> = []
    for (let i = 0; i < maxLen; i++) {
      const row = inputs.map(node => {
        const len = node.payload.length
        // if we're within bounds, take it; else repeat the last item
        return i < len
          ? node.payload[i]
          : node.payload[len - 1]
      }) as { [K in keyof Inputs]: InputOf<Inputs[K]> }

      result.push(row)
    }

    return result
  }

  public zipInputsToShortest<Inputs extends GraphNodeInputType<any>[]>(
    ...inputs: Inputs
  ): Array<{ [K in keyof Inputs]: InputOf<Inputs[K]> }> {
    // find the shortest payload length
    const lengths = inputs.map(i => i.payload.length)
    const minLen = Math.min(...lengths)

    // build up the result, trimming to minLen
    const result: Array<{ [K in keyof Inputs]: InputOf<Inputs[K]> }> = []
    for (let i = 0; i < minLen; i++) {
      const row = inputs.map(node => node.payload[i]) as {
        [K in keyof Inputs]: InputOf<Inputs[K]>
      }
      result.push(row)
    }

    return result
  }

  public productInputs<Inputs extends GraphNodeInputType<any>[]>(
    ...inputs: Inputs
  ): Array<{ [K in keyof Inputs]: InputOf<Inputs[K]> }> {
    // guard: bail out if any input has no values
    if (inputs.some(i => i.payload.length === 0)) {
      return []
    }

    // start with a single “empty” tuple
    let combos: any[][] = [[]]

    // for each input, extend existing tuples by every possible payload item
    for (const node of inputs) {
      combos = combos.flatMap(tuple =>
        node.payload.map(item => [...tuple, item])
      )
    }

    // assert our precise return type
    return combos as Array<{ [K in keyof Inputs]: InputOf<Inputs[K]> }>
  }

  protected abstract solve(): void

  public inputAt(index: number): GraphNodeInput {
    return this.inputs[index]
  }

  public outputAt(index: number): GraphNodeOutput {
    return this.outputs[index]
  }

  public calculateHandleFactor(index: number, of: number) {
    if (index > of) {
      const msg = `The index ${index} cannot be great than of ${of}`
      throw new Error(msg)
    }

    const parts = of + 1
    const slices = 1 / parts
    const factor = slices * (index + 1)
    return factor
  }

  public calculateHandleHeight(index: number, of: number) {
    const factor = this.calculateHandleFactor(index, of)
    const height = factor * this.height
    return height
  }

  public calculateHandleCoordinate(index: number, of: number) {
    const height = this.calculateHandleHeight(index, of)
    const coordinate = this.y + height
    return coordinate
  }
}
