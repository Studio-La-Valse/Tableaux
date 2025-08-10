import type { ComponentState } from './component-state'
import type { GraphNodeInput } from './graph-node-input'
import type { GraphNodeOutput } from './graph-node-output'
import { InputIteratorsAsync } from './input-iterators-async'
import type { JsonObject } from './models/json-value'

/**
 * Abstract base class representing the core logic of a graph node.
 * Handles lifecycle management and input/output subscriptions.
 */
export abstract class GraphNodeCore {
  // Indicates whether the node has been initialized
  protected _initialized: boolean = false

  // A globally accassible error message.
  public errorMessage: string = ''

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
   * Field that contains data for the graphnode.
   */
  public readonly data: JsonObject = {}

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
    this.outputs.forEach((output) => output.trySubscribe(this.id))
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

    this.outputs.forEach((output) => output.trySubscribe(graphNodeId))
  }

  /**
   * Marks the node as initialized.
   */
  public onInitialize(): void {
    this.errorMessage = ''
    this._initialized = true
  }

  /**
   * Arms the node and propagates arming to all outputs.
   */
  public arm(): void {
    this.errorMessage = ''
    this.componentState = 'armed'
    this.outputs.forEach((output) => output.arm())
  }

  /**
   * Attempts to execute the node's computation.
   *
   * Contract:
   * - Synchronous entrypoint (returns void). All async work is awaited internally via Promises.
   * - If a run is already in flight, this:
   *   - marks a rerun as pending, and
   *   - cancels the in-flight run via AbortController.abort().
   * - Starts a fresh run when idle:
   *   - clears error state,
   *   - transitions componentState -> 'working',
   *   - arms all outputs,
   *   - calls solve(signal) which MUST observe the AbortSignal (either reject with AbortError or bail early),
   *   - on success, transitions componentState -> 'complete',
   *   - on non-abort failure, transitions componentState -> 'error' and sets errorMessage,
   *   - finally, completes all outputs, clears the controller, and
   *   - if a rerun was requested and inputs are still unarmed, triggers exactly one more run.
   *
   * Notes:
   * - Multiple rapid calls while running collapse into a single rerun (coalescing).
   * - If an abort happens and solve still resolves, we guard UI updates with signal.aborted checks.
   * - If solve rejects because of an abort, we swallow it (treat as cancellation, not an error).
   * - Outputs' arm()/complete() are assumed to be idempotent.
   * - Inputs are checked before starting or re-starting; if any input is armed we do nothing.
   */
  private _controller?: AbortController
  private _rerunRequested = false

  public complete(): void {
    // Do not start if any input is currently armed (precondition not met).
    if (this.inputs.some((i) => i.armed)) return

    // Reset transient errors and move to "working".
    this.errorMessage = ''
    this.componentState = 'working'

    // If a run is already in progress, request a rerun and cancel the current one.
    // abort() is idempotent; calling it multiple times is safe.
    if (this._controller) {
      this._rerunRequested = true
      this._controller.abort()
      return
    }

    // Start a new run with a fresh controller/signal.
    this._controller = new AbortController()
    const signal = this._controller.signal

    // Arm all outputs before solving; idempotent arm() is recommended.
    for (const o of this.outputs) {
      try {
        o.arm()
      } catch (e) {
        this.setError(e)
        return
      }
    }

    // create the iterators
    const yieldEvery = 10_000
    const iterators = new InputIteratorsAsync({ signal, yieldEvery })

    // Kick off the async solve, passing the signal for cancellation.
    this.solve(iterators)
      .then(() => {
        // Only mark complete if we were not aborted during/after solve.
        this.componentState = 'complete'

        // Complete outputs
        for (const o of this.outputs) {
          try {
            o.complete()
          } catch (e) {
            this.setError(e)
            break
          }
        }
      })
      .catch((error) => {
        // If the error happened because we aborted, treat it as a cancel, not an error.
        if (signal.aborted) {
          // no rerun requested, this was an abort action, arm the component and bail
          if (!this._rerunRequested) {
            this.arm()
          }
          return
        }

        this.setError(error)
      })
      .finally(() => {
        // Clear the controller to mark this run as finished.
        this._controller = undefined

        // If another call came in while we were running, run once more,
        // provided inputs are still ready. Coalesces bursts into a single extra run.
        if (this._rerunRequested && !this.inputs.some((i) => i.armed)) {
          this._rerunRequested = false
          this.complete()
        }
      })
  }

  /**
   * Set error state
   * @param error
   */
  private setError(error: unknown) {
    this.componentState = 'error'

    const _error = error instanceof Error ? error : new Error(String(error))
    this.errorMessage = _error.message
  }

  /**
   * Abstract method where concrete node logic should be implemented.
   */
  protected abstract solve(iterators: InputIteratorsAsync): Promise<void>

  /**
   * Recompute the node
   */
  public recompute(): void {
    this.arm()
    this.complete()
  }

  /**
   * Abort the current calculation of the node
   */
  public abort(): void {
    if (!this._controller) return
    this._controller.abort()
  }

  /**
   * Virtual method to define what happens when a component is destroyed.
   */
  public onDestroy(): void {
    if (this._controller) this._controller.abort()
    this._controller = undefined

    this.arm()

    this._initialized = false
  }
}
