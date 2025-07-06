import { GraphNodeAlreadyInitializedError } from './errors/graph-node-already-initialized-error'
import { GraphNodeCore } from './graph-node-core'
import {
  GraphNodeInputBoolean,
  GraphNodeInputNumber,
  GraphNodeInputObject,
  GraphNodeInputString,
  GraphNodeInputUnkown,
  GraphNodeInputType,
} from './graph-node-input'
import {
  GraphNodeOutputBoolean,
  GraphNodeOutputNumber,
  GraphNodeOutputObject,
  GraphNodeOutputString,
  GraphNodeOutputUnkown,
  GraphNodeOutputType,
} from './graph-node-output'

export const componentStates = {
  armed: 'armed',
  calculating: 'calculating',
  error: 'error',
  complete: 'complete',
} as const

export type ComponentState = (typeof componentStates)[keyof typeof componentStates]

/**
 * GraphNode is the public-facing interface for individual nodes in a graph.
 * Handles visual layout and input/output registration.
 */
export abstract class GraphNode extends GraphNodeCore {
  constructor(
    public readonly id: string,
    public readonly path: string[],
  ) {
    super(id, path)
  }

  // --- Input Registration ---

  public registerBooleanInput(description: string): GraphNodeInputType<boolean> {
    this.assertNotInitialized()
    const input = new GraphNodeInputBoolean(this, this.numberOfInputs, description)
    this._inputs.push(input)
    return input
  }

  public registerNumberInput(description: string): GraphNodeInputType<number> {
    this.assertNotInitialized()
    const input = new GraphNodeInputNumber(this, this.numberOfInputs, description)
    this._inputs.push(input)
    return input
  }

  public registerStringInput(description: string): GraphNodeInputType<string> {
    this.assertNotInitialized()
    const input = new GraphNodeInputString(this, this.numberOfInputs, description)
    this._inputs.push(input)
    return input
  }

  public registerObjectInput(description: string): GraphNodeInputType<object> {
    this.assertNotInitialized()
    const input = new GraphNodeInputObject(this, this.numberOfInputs, description)
    this._inputs.push(input)
    return input
  }

  public registerUnkownInput(description: string): GraphNodeInputType<unknown> {
    this.assertNotInitialized()
    const input = new GraphNodeInputUnkown(this, this.numberOfInputs, description)
    this._inputs.push(input)
    return input
  }

  public registerBooleanOutput(description: string): GraphNodeOutputType<boolean> {
    this.assertNotInitialized()
    const output = new GraphNodeOutputBoolean(this, this.numberOfOutputs, description)
    this._outputs.push(output)
    return output
  }

  public registerNumberOutput(description: string): GraphNodeOutputType<number> {
    this.assertNotInitialized()
    const output = new GraphNodeOutputNumber(this, this.numberOfOutputs, description)
    this._outputs.push(output)
    return output
  }

  public registerStringOutput(description: string): GraphNodeOutputType<string> {
    this.assertNotInitialized()
    const output = new GraphNodeOutputString(this, this.numberOfOutputs, description)
    this._outputs.push(output)
    return output
  }

  public registerObjectOutput(description: string): GraphNodeOutputType<object> {
    this.assertNotInitialized()
    const output = new GraphNodeOutputObject(this, this.numberOfOutputs, description)
    this._outputs.push(output)
    return output
  }

  public registerUnkownOutput(description: string): GraphNodeOutputType<unknown> {
    this.assertNotInitialized()
    const output = new GraphNodeOutputUnkown(this, this.numberOfOutputs, description)
    this._outputs.push(output)
    return output
  }

  /**
   * Throws if the node has already been initialized.
   */
  private assertNotInitialized(): void {
    if (this._initialized) {
      throw new GraphNodeAlreadyInitializedError()
    }
  }
}
