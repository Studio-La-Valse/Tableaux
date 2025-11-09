import type { NodeClass } from '../graph-nodes/graph-node-definition'
import type { ComponentState } from './component-state'
import type {
  GraphNodeInput,
  IGraphNodeInput,
} from './graph-node-input'
import type { IGraphNodeOutput } from './graph-node-output'
import type { JsonObject, JsonValue } from './models/json-value'
import { CannotRemoveLastParamError } from './errors/cannot-remove-last-param-error'
import { CannotRemoveSubscribedParamError } from './errors/cannot-remove-subscribed-param-error'
import { GraphNodeAlreadyInitializedError } from './errors/graph-node-already-initialized-error'
import { InvalidRemovalIndexError } from './errors/invalid-removal-index-error'
import { ParamsAlreadySetError } from './errors/params-already-set-error'
import { ParamsNotSetError } from './errors/params-not-set-error'
import { GraphNodeCore } from './graph-node-core'
import {
  GraphNodeInputBoolean,
  GraphNodeInputNumber,
  GraphNodeInputObject,
  GraphNodeInputString,
  GraphNodeInputUnknown,

} from './graph-node-input'
import {
  GraphNodeOutputBoolean,
  GraphNodeOutputNumber,
  GraphNodeOutputObject,
  GraphNodeOutputString,
  GraphNodeOutputUnknown,

} from './graph-node-output'

export type IGraphNode = {
  readonly instanceId: string
  readonly modelId: string

  readonly inputs: IGraphNodeInput[]
  readonly outputs: IGraphNodeOutput[]

  readonly errorMessage: string
  readonly componentState: ComponentState

  readonly data: JsonObject

  onInitialize: () => void
  arm: () => void
  complete: () => void
  recompute: () => void
  abort: () => void
  onDestroy: () => void
}

/**
 * GraphNode is the public-facing interface for individual nodes in a graph.
 * Handles input/output registration.
 */
export abstract class GraphNode extends GraphNodeCore implements IGraphNode {
  /** Optional typed constructor accessor for metadata */
  public get ctor(): NodeClass {
    return this.constructor as unknown as NodeClass
  }

  public get nodePath(): string[] {
    return (this.constructor as NodeClass).__graphNodePath!
  }

  constructor(modelId: string) {
    super(modelId)
  }

  // --- Define params type input ---

  public get paramsInputOrigin(): GraphNodeInput | undefined {
    return this._params[0]
  }

  private get _params(): GraphNodeInput[] {
    return (
      this._booleanParams
      || this._numberParams
      || this._stringParams
      || this._objectParams
      || this._unknownParams
      || []
    )
  }

  private _booleanParams: GraphNodeInputBoolean[] | undefined
  public registerBooleanInputParams(description: string) {
    this.assertNotInitialized()
    this.assertParamsHasNotBeenSet()

    const input1 = new GraphNodeInputBoolean(this, description)
    const input2 = new GraphNodeInputBoolean(this, description)
    this._booleanParams = []
    this._booleanParams.push(input1)
    this._booleanParams.push(input2)
    this._inputs.push(input1)
    this._inputs.push(input2)
    this.data.params_length = 2

    return this._booleanParams
  }

  private _numberParams: GraphNodeInputNumber[] | undefined
  public registerNumberInputParams(description: string) {
    this.assertNotInitialized()
    this.assertParamsHasNotBeenSet()

    const input1 = new GraphNodeInputNumber(this, description)
    const input2 = new GraphNodeInputNumber(this, description)
    this._numberParams = []
    this._numberParams.push(input1)
    this._numberParams.push(input2)
    this._inputs.push(input1)
    this._inputs.push(input2)
    this.data.params_length = 2

    return this._numberParams
  }

  private _stringParams: GraphNodeInputString[] | undefined
  public registerStringInputParams(description: string) {
    this.assertNotInitialized()
    this.assertParamsHasNotBeenSet()

    const input1 = new GraphNodeInputString(this, description)
    const input2 = new GraphNodeInputString(this, description)
    this._stringParams = []
    this._stringParams.push(input1)
    this._stringParams.push(input2)
    this._inputs.push(input1)
    this._inputs.push(input2)
    this.data.params_length = 2

    return this._stringParams
  }

  private _objectParams: GraphNodeInputObject[] | undefined
  public registerObjectInputParams(description: string) {
    this.assertNotInitialized()
    this.assertParamsHasNotBeenSet()

    const input1 = new GraphNodeInputObject(this, description)
    const input2 = new GraphNodeInputObject(this, description)
    this._objectParams = []
    this._objectParams.push(input1)
    this._objectParams.push(input2)
    this._inputs.push(input1)
    this._inputs.push(input2)
    this.data.params_length = 2

    return this._objectParams
  }

  private _unknownParams: GraphNodeInputUnknown[] | undefined
  public registerUnkownInputParams(description: string) {
    this.assertNotInitialized()
    this.assertParamsHasNotBeenSet()

    const input1 = new GraphNodeInputUnknown(this, description)
    const input2 = new GraphNodeInputUnknown(this, description)
    this._unknownParams = []
    this._unknownParams.push(input1)
    this._unknownParams.push(input2)
    this._inputs.push(input1)
    this._inputs.push(input2)
    this.data.params_length = 2

    return this._unknownParams
  }

  public canInsertInput(index: number) {
    if (!this.paramsInputOrigin) {
      return false
    }
    const originIndex = this.paramsInputOrigin.index
    if (index < originIndex) {
      return false
    }
    return true
  }

  public canRemoveInput(index: number) {
    if (!this.paramsInputOrigin) {
      return false
    }
    const originIndex = this.paramsInputOrigin.index
    if (index < originIndex) {
      return false
    }
    const numberOfParams = this._params.length
    if (numberOfParams <= 2) {
      return false
    }
    const toRemove = this.inputs[index]
    if (toRemove.isSubscribed) {
      return false
    }

    return true
  }

  public insertInput(index: number) {
    const origin = this.assertParamsHasBeenSet()

    const originIndex = origin.index
    if (index < originIndex) {
      throw new InvalidRemovalIndexError()
    }

    const indexInParams = index - originIndex

    const newInput = origin.repeat()
    newInput.arm()

    this._params.splice(indexInParams, 0, newInput)
    this._inputs.splice(index, 0, newInput)
    this.data.params_length = this._params.length
  }

  public removeInput(index: number) {
    const origin = this.assertParamsHasBeenSet()

    const originIndex = origin.index
    if (index < originIndex) {
      throw new InvalidRemovalIndexError()
    }

    if (this._params.length <= 2) {
      throw new CannotRemoveLastParamError()
    }

    const toRemove = this._params[index]
    if (toRemove.isSubscribed) {
      throw new CannotRemoveSubscribedParamError(index)
    }

    const indexInParams = index - originIndex
    this._params.splice(indexInParams, 1)
    this._inputs.splice(index, 1)
    this.data.params_length = this._params.length

    this.complete()
  }

  public setParamsLength(length: number) {
    if (length < 1) {
      throw new Error('Params must have at least one input.')
    }

    const origin = this.assertParamsHasBeenSet()
    const originIndex = origin.index

    // Remove excess inputs
    while (this._params.length > length) {
      const indexToRemove = originIndex + this._params.length - 1
      this.removeInput(indexToRemove)
    }

    // Insert additional inputs
    while (this._params.length < length) {
      const indexToInsert = originIndex + this._params.length - 1
      this.insertInput(indexToInsert)
    }
  }

  // --- Input Registration ---

  public registerBooleanInput(
    description: string,
    defaultPayload?: boolean[],
  ): GraphNodeInputBoolean {
    this.assertNotInitialized()
    this.assertParamsHasNotBeenSet()

    const input = new GraphNodeInputBoolean(this, description, defaultPayload)
    this._inputs.push(input)
    return input
  }

  public registerNumberInput(description: string, defaultPayload?: number[]): GraphNodeInputNumber {
    this.assertNotInitialized()
    this.assertParamsHasNotBeenSet()

    const input = new GraphNodeInputNumber(this, description, defaultPayload)
    this._inputs.push(input)
    return input
  }

  public registerStringInput(description: string, defaultPayload?: string[]): GraphNodeInputString {
    this.assertNotInitialized()
    this.assertParamsHasNotBeenSet()

    const input = new GraphNodeInputString(this, description, defaultPayload)
    this._inputs.push(input)
    return input
  }

  public registerObjectInput(
    description: string,
    defaultPayload?: JsonObject[],
  ): GraphNodeInputObject {
    this.assertNotInitialized()
    this.assertParamsHasNotBeenSet()

    const input = new GraphNodeInputObject(this, description, defaultPayload)
    this._inputs.push(input)
    return input
  }

  public registerUnknownInput(
    description: string,
    defaultPayload?: JsonValue[],
  ): GraphNodeInputUnknown {
    this.assertNotInitialized()
    this.assertParamsHasNotBeenSet()

    const input = new GraphNodeInputUnknown(this, description, defaultPayload)
    this._inputs.push(input)
    return input
  }

  // --- Output Registration ---

  public registerBooleanOutput(description: string): GraphNodeOutputBoolean {
    this.assertNotInitialized()

    const output = new GraphNodeOutputBoolean(this, this.numberOfOutputs, description)
    this._outputs.push(output)
    return output
  }

  public registerNumberOutput(description: string): GraphNodeOutputNumber {
    this.assertNotInitialized()

    const output = new GraphNodeOutputNumber(this, this.numberOfOutputs, description)
    this._outputs.push(output)
    return output
  }

  public registerStringOutput(description: string): GraphNodeOutputString {
    this.assertNotInitialized()

    const output = new GraphNodeOutputString(this, this.numberOfOutputs, description)
    this._outputs.push(output)
    return output
  }

  public registerObjectOutput<T extends JsonObject>(description: string): GraphNodeOutputObject<T> {
    this.assertNotInitialized()

    const output = new GraphNodeOutputObject<T>(this, this.numberOfOutputs, description)
    this._outputs.push(output)
    return output
  }

  public registerUnknownOutput(description: string): GraphNodeOutputUnknown {
    this.assertNotInitialized()

    const output = new GraphNodeOutputUnknown(this, this.numberOfOutputs, description)
    this._outputs.push(output)
    return output
  }

  // --- assertions ---

  public assertNotInitialized() {
    if (this._initialized) {
      throw new GraphNodeAlreadyInitializedError()
    }
  }

  public assertParamsHasNotBeenSet() {
    if (this.paramsInputOrigin) {
      throw new ParamsAlreadySetError()
    }
  }

  public assertParamsHasBeenSet(): GraphNodeInput {
    if (!this.paramsInputOrigin) {
      throw new ParamsNotSetError()
    }

    return this.paramsInputOrigin
  }
}
