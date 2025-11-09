import type { IGraphNodeInputType } from './graph-node-input'

type InputOf<O> = O extends IGraphNodeInputType<infer U> ? U : never

type RowOf<Inputs extends IGraphNodeInputType<unknown>[]> = {
  [K in keyof Inputs]: InputOf<Inputs[K]>;
}

type CycleOptions = {
  signal?: AbortSignal
  yieldEvery?: number // default: 10_000
}

function toAbortError(): Error {
  try {
    return new DOMException('The operation was aborted.', 'AbortError')
  }
  catch {
    const e = new Error('The operation was aborted.')
    e.name = 'AbortError'
    return e
  }
}

function nextTick(signal?: AbortSignal): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted)
      return reject(toAbortError())

    let timeout: ReturnType<typeof setTimeout>
    let onAbort: () => void

    const cleanup = () => {
      clearTimeout(timeout)
      signal?.removeEventListener('abort', onAbort)
    }

    onAbort = () => {
      cleanup()
      reject(toAbortError())
    }

    timeout = setTimeout(() => {
      cleanup()
      resolve()
    }, 0)

    signal?.addEventListener('abort', onAbort, { once: true })
  })
}

export class InputIteratorsAsync {
  constructor(public readonly options: CycleOptions = {}) { }

  /**
   * Core async generator for producing integer ranges.
   * Handles abort + cooperative yielding.
   */
  public async* createRange(start: number, stop: number, step: number) {
    const { signal, yieldEvery = 10_000 } = this.options

    let count = 0
    for (let i = start; i < stop; i += step) {
      if (signal?.aborted)
        throw toAbortError()
      if (count !== 0 && count % yieldEvery === 0) {
        await nextTick(signal)
      }
      yield i
      count++
    }
  }

  /**
   * Forward iteration over a single input.
   */
  public async* createGenerator<Input extends IGraphNodeInputType<unknown>>(
    input: Input,
  ): AsyncGenerator<InputOf<Input>> {
    for await (const i of this.createRange(0, input.payloadLength, 1)) {
      yield input.peek(i) as InputOf<Input>
    }
  }

  /**
   * Reverse iteration over a single input.
   */
  public async* createGeneratorReversed<Input extends IGraphNodeInputType<unknown>>(
    input: Input,
  ): AsyncGenerator<InputOf<Input>> {
    const len = input.payloadLength
    for await (const offset of this.createRange(0, len, 1)) {
      const i = len - 1 - offset
      yield input.peek(i) as InputOf<Input>
    }
  }

  /**
   * Cycle inputs to match the longest length.
   */
  public async* cycleValues<Inputs extends IGraphNodeInputType<unknown>[]>(
    ...inputs: Inputs
  ): AsyncGenerator<RowOf<Inputs>> {
    const lengths = inputs.map(i => i.payloadLength)
    const maxLen = Math.max(...lengths)

    if (inputs.length >= 2 && maxLen > 0 && lengths.includes(0)) {
      throw new Error(
        `cycleInputsValues: all payloads must be non-empty. Got lengths=[${lengths.join(',')}]`,
      )
    }

    for await (const i of this.createRange(0, maxLen, 1)) {
      yield inputs.map(node => node.peek(i % node.payloadLength)) as RowOf<Inputs>
    }
  }

  /**
   * Cycle only if all lengths divide the max.
   */
  public async* cycleMultiples<Inputs extends IGraphNodeInputType<unknown>[]>(
    ...inputs: Inputs
  ): AsyncGenerator<RowOf<Inputs>> {
    const lengths = inputs.map(i => i.payloadLength)
    const maxLen = Math.max(...lengths)

    if (inputs.length >= 2 && lengths.some(len => len === 0 || maxLen % len !== 0)) {
      throw new Error(
        `cycleInputsMultiples: payload lengths [${lengths.join(',')}] must all be >0 and divide ${maxLen}`,
      )
    }

    for await (const i of this.createRange(0, maxLen, 1)) {
      yield inputs.map(node => node.peek(i % node.payloadLength)) as RowOf<Inputs>
    }
  }

  /**
   * Extend shorter inputs by repeating their last value.
   */
  public async* fillLast<Inputs extends IGraphNodeInputType<unknown>[]>(
    ...inputs: Inputs
  ): AsyncGenerator<RowOf<Inputs>> {
    const lengths = inputs.map(i => i.payloadLength)
    const maxLen = Math.max(...lengths)

    if (inputs.length >= 2 && lengths.includes(0)) {
      throw new Error(
        `cycleInputsFillLast: all payloads must be non-empty. Got lengths=[${lengths.join(',')}]`,
      )
    }

    for await (const i of this.createRange(0, maxLen, 1)) {
      yield inputs.map((node) => {
        const len = node.payloadLength
        return i < len ? node.peek(i) : node.peek(len - 1)
      }) as RowOf<Inputs>
    }
  }

  /**
   * Zip inputs to the shortest length.
   */
  public async* zipToShortest<Inputs extends IGraphNodeInputType<unknown>[]>(
    ...inputs: Inputs
  ): AsyncGenerator<RowOf<Inputs>> {
    const minLen = Math.min(...inputs.map(i => i.payloadLength))
    if (minLen === 0)
      return

    for await (const i of this.createRange(0, minLen, 1)) {
      yield inputs.map(node => node.peek(i)) as RowOf<Inputs>
    }
  }

  /**
   * Cartesian product of all payload values.
   */
  public async* cartesianProduct<Inputs extends IGraphNodeInputType<unknown>[]>(
    ...inputs: Inputs
  ): AsyncGenerator<RowOf<Inputs>> {
    if (inputs.some(i => i.payloadLength === 0))
      return

    let combos: unknown[][] = [[]]

    for (const node of inputs) {
      const newCombos: unknown[][] = []
      for await (const i of this.createRange(0, node.payloadLength, 1)) {
        const value = node.peek(i)
        for (const tuple of combos) {
          newCombos.push([...tuple, value])
        }
      }
      combos = newCombos
    }

    for await (const i of this.createRange(0, combos.length, 1)) {
      yield combos[i] as RowOf<Inputs>
    }
  }

  /**
   * Ensure all payloads contain exactly one item.
   */
  public singletonOnly<Inputs extends IGraphNodeInputType<unknown>[]>(
    ...inputs: Inputs
  ): RowOf<Inputs> {
    const lengths = inputs.map(i => i.payloadLength)
    if (lengths.some(len => len !== 1)) {
      throw new Error(
        `cycleInputsSingleton: all payloads must be length 1. Got lengths=[${lengths.join(',')}]`,
      )
    }
    return inputs.map(i => i.peek(0)) as RowOf<Inputs>
  }
}
