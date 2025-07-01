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

export type ComponentState = typeof componentStates[keyof typeof componentStates]

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

    public registerBooleanInput(): GraphNodeInputType<boolean> {
        this.assertNotInitialized()
        const input = new GraphNodeInputBoolean(this, this.numberOfInputs)
        this._inputs.push(input)
        return input
    }

    public registerNumberInput(): GraphNodeInputType<number> {
        this.assertNotInitialized()
        const input = new GraphNodeInputNumber(this, this.numberOfInputs)
        this._inputs.push(input)
        return input
    }

    public registerStringInput(): GraphNodeInputType<string> {
        this.assertNotInitialized()
        const input = new GraphNodeInputString(this, this.numberOfInputs)
        this._inputs.push(input)
        return input
    }

    public registerObjectInput(): GraphNodeInputType<object> {
        this.assertNotInitialized()
        const input = new GraphNodeInputObject(this, this.numberOfInputs)
        this._inputs.push(input)
        return input
    }

    public registerUnkownInput(): GraphNodeInputType<unknown> {
        this.assertNotInitialized()
        const input = new GraphNodeInputUnkown(this, this.numberOfInputs)
        this._inputs.push(input)
        return input
    }

    // --- Output Registration ---

    public registerBooleanOutput(): GraphNodeOutputType<boolean> {
        this.assertNotInitialized()
        const output = new GraphNodeOutputBoolean(this, this.numberOfOutputs)
        this._outputs.push(output)
        return output
    }

    public registerNumberOutput(): GraphNodeOutputType<number> {
        this.assertNotInitialized()
        const output = new GraphNodeOutputNumber(this, this.numberOfOutputs)
        this._outputs.push(output)
        return output
    }

    public registerTextOutput(): GraphNodeOutputType<string> {
        this.assertNotInitialized()
        const output = new GraphNodeOutputString(this, this.numberOfOutputs)
        this._outputs.push(output)
        return output
    }

    public registerObjectOutput(): GraphNodeOutputType<object> {
        this.assertNotInitialized()
        const output = new GraphNodeOutputObject(this, this.numberOfOutputs)
        this._outputs.push(output)
        return output
    }

    public registerUnkownOutput(): GraphNodeOutputType<unknown> {
        this.assertNotInitialized()
        const output = new GraphNodeOutputUnkown(this, this.numberOfOutputs)
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
