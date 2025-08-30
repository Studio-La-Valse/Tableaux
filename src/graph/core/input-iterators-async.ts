import type { IGraphNodeInputType } from './graph-node-input'

type InputOf<O> = O extends IGraphNodeInputType<infer U> ? U : never

type RowOf<Inputs extends IGraphNodeInputType<unknown>[]> = {
  [K in keyof Inputs]: InputOf<Inputs[K]>
}

// Optional: tailor these to your codebase
type CycleOptions = {
  signal?: AbortSignal
  yieldEvery?: number // default: 10_000
}

function toAbortError(): Error {
  try {
    return new DOMException('The operation was aborted.', 'AbortError')
  } catch {
    const e = new Error('The operation was aborted.')
    e.name = 'AbortError'
    return e
  }
}

function nextTick(signal?: AbortSignal): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) return reject(toAbortError())
    const onAbort = () => {
      cleanup()
      reject(toAbortError())
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

export class InputIteratorsAsync {
  constructor(public readonly options: CycleOptions = {}) {}

  /**
   * Async generator that yields a number as part of a range.
   * Yields to the UI periodically and supports abort via AbortSignal.
   */
  public async *createRange(start: number, stop: number, step: number) {
    const { signal, yieldEvery = 10_000 } = this.options

    for (let i = start; i < stop; i += step) {
      if (signal?.aborted) throw toAbortError()
      if (i !== 0 && i % yieldEvery === 0) {
        await nextTick(signal)
      }

      yield i
    }
  }

  /**
   * Async generator that yields tuples, cycling each input to match the longest length.
   * Throws if any payload is empty.
   * Yields to the UI periodically and supports abort via AbortSignal.
   */
  public async *createGenerator<Input extends IGraphNodeInputType<unknown>>(
    input: Input,
  ): AsyncGenerator<InputOf<Input>> {
    const { signal, yieldEvery = 10_000 } = this.options

    const length = input.payloadLength
    for (let i = 0; i < length; i++) {
      if (signal?.aborted) throw toAbortError()
      if (i !== 0 && i % yieldEvery === 0) {
        await nextTick(signal)
      }

      const value = input.peek(i) as InputOf<Input>
      yield value
    }
  }

  /**
   * Async generator that yields tuples, cycling each input to match the longest length.
   * Throws if any payload is empty.
   * Yields to the UI periodically and supports abort via AbortSignal.
   */
  public async *cycleValues<Inputs extends IGraphNodeInputType<unknown>[]>(
    ...inputs: Inputs
  ): AsyncGenerator<RowOf<Inputs>> {
    const { signal, yieldEvery = 10_000 } = this.options
    const lengths = inputs.map((i) => i.payloadLength)
    const maxLen = Math.max(...lengths)

    if (inputs.length >= 2 && maxLen > 0 && lengths.some((len) => len === 0)) {
      throw new Error(
        `cycleInputsValues: all payloads must be non-empty. Got lengths=[${lengths.join(',')}]`,
      )
    }

    for (let i = 0; i < maxLen; i++) {
      if (signal?.aborted) throw toAbortError()
      if (i !== 0 && i % yieldEvery === 0) {
        await nextTick(signal)
      }

      const row = inputs.map((node) => node.peek(i % node.payloadLength)) as RowOf<Inputs>

      yield row
    }
  }

  /**
   * Async generator that yields tuples only if all payload lengths divide the max length.
   * Throws if any payload is empty or not a clean divisor of the max.
   * Yields to the UI periodically and supports abort via AbortSignal.
   */
  public async *cycleMultiples<Inputs extends IGraphNodeInputType<unknown>[]>(
    ...inputs: Inputs
  ): AsyncGenerator<RowOf<Inputs>> {
    const { signal, yieldEvery = 10_000 } = this.options

    const lengths = inputs.map((i) => i.payloadLength)
    const maxLen = Math.max(...lengths)

    if (inputs.length >= 2 && lengths.some((len) => len === 0 || maxLen % len !== 0)) {
      throw new Error(
        `cycleInputsMultiples: payload lengths [${lengths.join(',')}] must all be >0 and divide ${maxLen}`,
      )
    }

    for (let i = 0; i < maxLen; i++) {
      if (signal?.aborted) throw toAbortError()
      if (i !== 0 && i % yieldEvery === 0) {
        await nextTick(signal)
      }

      const row = inputs.map((node) => node.peek(i % node.payloadLength)) as RowOf<Inputs>

      yield row
    }
  }

  /**
   * Async generator that yields tuples of payload values.
   * Short inputs are extended by repeating their last value.
   * Throws if any payload is empty.
   * Yields to the UI periodically and supports abort via AbortSignal.
   */
  public async *fillLast<Inputs extends IGraphNodeInputType<unknown>[]>(
    ...inputs: Inputs
  ): AsyncGenerator<RowOf<Inputs>> {
    const { signal, yieldEvery = 10_000 } = this.options

    const lengths = inputs.map((i) => i.payloadLength)
    const maxLen = Math.max(...lengths)

    if (inputs.length >= 2 && lengths.some((len) => len === 0)) {
      throw new Error(
        `cycleInputsFillLast: all payloads must be non-empty. Got lengths=[${lengths.join(',')}]`,
      )
    }

    for (let i = 0; i < maxLen; i++) {
      if (signal?.aborted) throw toAbortError()
      if (i !== 0 && i % yieldEvery === 0) {
        await nextTick(signal)
      }

      const row = inputs.map((node) => {
        const len = node.payloadLength
        return i < len ? node.peek(i) : node.peek(len - 1)
      }) as RowOf<Inputs>

      yield row
    }
  }

  /**
   * Async generator that zips payloads to the shortest length, trimming longer ones.
   * Returns no values if any payload is empty.
   * Yields to the UI periodically and supports abort via AbortSignal.
   */
  public async *zipToShortest<Inputs extends IGraphNodeInputType<unknown>[]>(
    ...inputs: Inputs
  ): AsyncGenerator<RowOf<Inputs>> {
    const { signal, yieldEvery = 10_000 } = this.options

    const minLen = Math.min(...inputs.map((i) => i.payloadLength))

    if (minLen === 0) {
      return
    }

    for (let i = 0; i < minLen; i++) {
      if (signal?.aborted) throw toAbortError()
      if (i !== 0 && i % yieldEvery === 0) {
        await nextTick(signal)
      }

      const row = inputs.map((node) => node.peek(i)) as RowOf<Inputs>

      yield row
    }
  }

  /**
   * Async generator that yields the Cartesian product of all payload values.
   * Returns no values if any payload is empty.
   * Yields to the UI periodically and supports abort via AbortSignal.
   */
  public async *cartesianProduct<Inputs extends IGraphNodeInputType<unknown>[]>(
    ...inputs: Inputs
  ): AsyncGenerator<RowOf<Inputs>> {
    const { signal, yieldEvery = 10_000 } = this.options

    if (inputs.some((i) => i.payloadLength === 0)) {
      return
    }

    let combos: unknown[][] = [[]]

    for (const node of inputs) {
      const newCombos: unknown[][] = []

      for (let i = 0; i < node.payloadLength; i++) {
        await nextTick(signal)
        if (signal?.aborted) throw toAbortError()

        const value = node.peek(i)
        for (const tuple of combos) {
          newCombos.push([...tuple, value])
        }
      }

      combos = newCombos
    }

    for (let i = 0; i < combos.length; i++) {
      if (signal?.aborted) throw toAbortError()
      if (i !== 0 && i % yieldEvery === 0) {
        await nextTick(signal)
      }

      yield combos[i] as RowOf<Inputs>
    }
  }

  /**
   * Returns a single tuple of values, ensuring all payloads contain exactly one item.
   * Throws if any has length ≠ 1.
   */
  public singletonOnly<Inputs extends IGraphNodeInputType<unknown>[]>(
    ...inputs: Inputs
  ): RowOf<Inputs> {
    const lengths = inputs.map((i) => i.payloadLength)

    if (lengths.some((len) => len !== 1)) {
      throw new Error(
        `cycleInputsSingleton: all payloads must be length 1. Got lengths=[${lengths.join(',')}]`,
      )
    }

    return inputs.map((i) => i.peek(0)) as RowOf<Inputs>
  }
}
