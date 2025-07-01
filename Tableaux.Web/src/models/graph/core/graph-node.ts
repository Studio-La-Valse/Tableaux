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
    private _height = 50
    private _width = 150

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
        return Math.max(this.numberOfInputs, this.numberOfOutputs, 1) * 50
    }

    public get minWidth(): number {
        return 150
    }

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

    /**
     * Throws if the node has already been initialized.
     */
    private assertNotInitialized(): void {
        if (this._initialized) {
            throw new GraphNodeAlreadyInitializedError()
        }
    }
}
