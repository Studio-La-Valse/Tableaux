import type { ComponentState } from "./graph-node"
import type { GraphNodeInput } from "./graph-node-input"
import type { GraphNodeOutput } from "./graph-node-output"

/**
 * Abstract base class representing the core logic of a graph node.
 * Handles lifecycle management and input/output subscriptions.
 */
export abstract class GraphNodeCore {
    // Indicates whether the node has been initialized
    protected _initialized: boolean = false

    // Current component state of the node
    public componentState: ComponentState

    // Internal input connections
    protected _inputs: GraphNodeInput[] = []

    /**
     * Returns a copy of all input connections
     */
    public get inputs(): GraphNodeInput[] {
        return [...this._inputs]
    }

    /**
     * Number of input connections
     */
    public get numberOfInputs(): number {
        return this._inputs.length
    }

    // Internal output connections
    protected _outputs: GraphNodeOutput[] = []

    /**
     * Returns a copy of all output connections
     */
    public get outputs(): GraphNodeOutput[] {
        return [...this._outputs]
    }

    /**
     * Number of output connections
     */
    public get numberOfOutputs(): number {
        return this._outputs.length
    }

    /**
     * Constructs a new GraphNodeCore instance.
     * @param id Unique identifier for this node
     * @param path Hierarchical path for locating the node
     */
    constructor(
        public id: string,
        public path: string[],
    ) {
        this.componentState = 'armed'
    }

    /**
     * Subscribes each output to this node's ID (self-subscription).
     */
    public trySubscribeSelf(): void {
        this.outputs.forEach(output => output.trySubscribe(this.id))
    }

    /**
     * Subscribes each output to the specified parent node.
     * Prevents circular subscriptions.
     * @param graphNodeId ID of the parent node to subscribe to
     * @throws Error if subscribing to self
     */
    public trySubscribeParent(graphNodeId: string): void {
        if (graphNodeId === this.id) {
            throw new Error(`Circular subscription detected for graph node ${graphNodeId}.`)
        }

        this.outputs.forEach(output => output.trySubscribe(graphNodeId))
    }

    /**
     * Marks the node as initialized.
     */
    public onInitialize(): void {
        this._initialized = true
    }

    /**
     * Arms the node and propagates arming to all outputs.
     */
    public arm(): void {
        this.componentState = 'armed'
        this.outputs.forEach(output => output.arm())
    }

    /**
     * Executes the computation process if all inputs are unarmed.
     * Manages state transitions and calls `solve()`.
     */
    public complete(): void {
        try {
            // Abort if any input is still armed
            if (this.inputs.some(input => input.armed)) return

            this.componentState = 'calculating'

            // Arm all outputs before solving
            this.outputs.forEach(output => output.arm())

            this.solve()

            this.componentState = 'complete'
        } catch (error) {
            console.error(error)
            this.componentState = 'error'
        } finally {
            // Notify all outputs of completion
            this.outputs.forEach(output => output.complete())
        }
    }

    /**
     * Abstract method where concrete node logic should be implemented.
     */
    protected abstract solve(): void

    /**
     * Virtual method to define what happens when a component is destroyed.
     */
    public onDestroy(): void {
        this._initialized = false;
    }
}
