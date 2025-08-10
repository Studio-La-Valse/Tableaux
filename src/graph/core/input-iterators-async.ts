import type { GraphNodeInputType } from './graph-node-input'

type InputOf<O> = O extends GraphNodeInputType<infer U> ? U : never

type RowOf<Inputs extends GraphNodeInputType<unknown>[]> = {
  [K in keyof Inputs]: InputOf<Inputs[K]>
}

// Optional: tailor these to your codebase
type CycleOptions = {
  signal?: AbortSignal
  yieldEvery?: number // default: 10_000
}

export class InputIteratorsAsync {
  constructor(public readonly options: CycleOptions = {}) {}

  public toAbortError(): Error {
    try {
      return new DOMException('The operation was aborted.', 'AbortError')
    } catch {
      const e = new Error('The operation was aborted.')
      e.name = 'AbortError'
      return e
    }
  }

  public nextTick(signal?: AbortSignal): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (signal?.aborted) return reject(this.toAbortError())
      const onAbort = () => {
        cleanup()
        reject(this.toAbortError())
      }
      const timeout = setTimeout(() => {
        cleanup()
        resolve()
      }, 0)
      const cleanup = () => {
        clearTimeout(timeout)
        signal?.removeEventListener('abort', onAbort)
      }
      signal?.addEventListener('abort', onAbort, { once: true })
    })
  }

  /**
   * Async generator that yields tuples, cycling each input to match the longest length.
   * Throws if any payload is empty.
   * Yields to the UI periodically and supports abort via AbortSignal.
   */
  public async *cycleValues<Inputs extends GraphNodeInputType<unknown>[]>(
    ...inputs: Inputs
  ): AsyncGenerator<RowOf<Inputs>> {
    const { signal, yieldEvery = 10_000 } = this.options
    const lengths = inputs.map((i) => i.payload.length)
    const maxLen = Math.max(...lengths)

    if (inputs.length >= 2 && lengths.some((len) => len === 0)) {
      throw new Error(
        `cycleInputsValues: all payloads must be non-empty. Got lengths=[${lengths.join(',')}]`,
      )
    }

    for (let i = 0; i < maxLen; i++) {
      if (signal?.aborted) throw this.toAbortError()
      if (i !== 0 && i % yieldEvery === 0) {
        await this.nextTick(signal)
      }

      const row = inputs.map((node) => node.payload[i % node.payload.length]) as RowOf<Inputs>

      yield row
    }
  }

  /**
   * Async generator that yields tuples only if all payload lengths divide the max length.
   * Throws if any payload is empty or not a clean divisor of the max.
   * Yields to the UI periodically and supports abort via AbortSignal.
   */
  public async *cycleMultiples<Inputs extends GraphNodeInputType<unknown>[]>(
    ...inputs: Inputs
  ): AsyncGenerator<RowOf<Inputs>> {
    const { signal, yieldEvery = 10_000 } = this.options

    const lengths = inputs.map((i) => i.payload.length)
    const maxLen = Math.max(...lengths)

    if (inputs.length >= 2 && lengths.some((len) => len === 0 || maxLen % len !== 0)) {
      throw new Error(
        `cycleInputsMultiples: payload lengths [${lengths.join(',')}] must all be >0 and divide ${maxLen}`,
      )
    }

    for (let i = 0; i < maxLen; i++) {
      if (signal?.aborted) throw this.toAbortError()
      if (i !== 0 && i % yieldEvery === 0) {
        await this.nextTick(signal)
      }

      const row = inputs.map((node) => node.payload[i % node.payload.length]) as RowOf<Inputs>

      yield row
    }
  }

  /**
   * Async generator that yields tuples of payload values.
   * Short inputs are extended by repeating their last value.
   * Throws if any payload is empty.
   * Yields to the UI periodically and supports abort via AbortSignal.
   */
  public async *fillLast<Inputs extends GraphNodeInputType<unknown>[]>(
    ...inputs: Inputs
  ): AsyncGenerator<RowOf<Inputs>> {
    const { signal, yieldEvery = 10_000 } = this.options

    const lengths = inputs.map((i) => i.payload.length)
    const maxLen = Math.max(...lengths)

    if (inputs.length >= 2 && lengths.some((len) => len === 0)) {
      throw new Error(
        `cycleInputsFillLast: all payloads must be non-empty. Got lengths=[${lengths.join(',')}]`,
      )
    }

    for (let i = 0; i < maxLen; i++) {
      if (signal?.aborted) throw this.toAbortError()
      if (i !== 0 && i % yieldEvery === 0) {
        await this.nextTick(signal)
      }

      const row = inputs.map((node) => {
        const { payload } = node
        return i < payload.length ? payload[i] : payload[payload.length - 1]
      }) as RowOf<Inputs>

      yield row
    }
  }

  /**
   * Async generator that zips payloads to the shortest length, trimming longer ones.
   * Returns no values if any payload is empty.
   * Yields to the UI periodically and supports abort via AbortSignal.
   */
  public async *zipToShortest<Inputs extends GraphNodeInputType<unknown>[]>(
    ...inputs: Inputs
  ): AsyncGenerator<RowOf<Inputs>> {
    const { signal, yieldEvery = 10_000 } = this.options

    const minLen = Math.min(...inputs.map((i) => i.payload.length))

    if (minLen === 0) {
      return
    }

    for (let i = 0; i < minLen; i++) {
      if (signal?.aborted) throw this.toAbortError()
      if (i !== 0 && i % yieldEvery === 0) {
        await this.nextTick(signal)
      }

      const row = inputs.map((node) => node.payload[i]) as RowOf<Inputs>

      yield row
    }
  }

  /**
   * Async generator that yields the Cartesian product of all payload values.
   * Returns no values if any payload is empty.
   * Yields to the UI periodically and supports abort via AbortSignal.
   */
  public async *cartesianProduct<Inputs extends GraphNodeInputType<unknown>[]>(
    ...inputs: Inputs
  ): AsyncGenerator<RowOf<Inputs>> {
    const { signal, yieldEvery = 10_000 } = this.options

    if (inputs.some((i) => i.payload.length === 0)) {
      return
    }

    let combos: unknown[][] = [[]]

    for (const node of inputs) {
      combos = combos.flatMap((tuple) => node.payload.map((value) => [...tuple, value]))

      // Optional: yield between layers to keep UI alive
      await this.nextTick(signal)
      if (signal?.aborted) throw this.toAbortError()
    }

    for (let i = 0; i < combos.length; i++) {
      if (signal?.aborted) throw this.toAbortError()
      if (i !== 0 && i % yieldEvery === 0) {
        await this.nextTick(signal)
      }

      yield combos[i] as RowOf<Inputs>
    }
  }

  /**
   * Returns a single tuple of values, ensuring all payloads contain exactly one item.
   * Throws if any has length ≠ 1.
   */
  public singletonOnly<Inputs extends GraphNodeInputType<unknown>[]>(
    ...inputs: Inputs
  ): RowOf<Inputs> {
    const lengths = inputs.map((i) => i.payload.length)

    if (lengths.some((len) => len !== 1)) {
      throw new Error(
        `cycleInputsSingleton: all payloads must be length 1. Got lengths=[${lengths.join(',')}]`,
      )
    }

    return inputs.map((i) => i.payload[0]) as RowOf<Inputs>
  }
}
