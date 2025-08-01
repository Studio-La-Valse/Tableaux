import type { GraphNodeInputType } from "./graph-node-input"

type InputOf<O> = O extends GraphNodeInputType<infer U> ? U : never

type RowOf<Inputs extends GraphNodeInputType<unknown>[]> = {
  [K in keyof Inputs]: InputOf<Inputs[K]>
}

// InputIterationUtils.ts
export const inputIterators = {
  cycleValues,
  cycleMultiples,
  fillLast,
  zipToShortest,
  cartesianProduct,
  singletonOnly,
}

/**
 * Returns tuples of payload values, cycling each input to match the longest length.
 * Throws if any payload is empty.
 */
function cycleValues<Inputs extends GraphNodeInputType<unknown>[]>(
  ...inputs: Inputs
): Array<RowOf<Inputs>> {
  const lengths = inputs.map((i) => i.payload.length)
  const maxLen = Math.max(...lengths)

  if (lengths.some((len) => len === 0)) {
    throw new Error(
      `cycleInputsValues: all payloads must be non-empty. Got lengths=[${lengths.join(',')}]`,
    )
  }

  return Array.from(
    { length: maxLen },
    (_, i) => inputs.map((node) => node.payload[i % node.payload.length]) as RowOf<Inputs>,
  )
}

/**
 * Returns tuples of payload values, only if all payloads have lengths that divide the longest.
 * Throws if any are empty or not clean divisors of the max.
 */
function cycleMultiples<Inputs extends GraphNodeInputType<unknown>[]>(
  ...inputs: Inputs
): Array<RowOf<Inputs>> {
  const lengths = inputs.map((i) => i.payload.length)
  const maxLen = Math.max(...lengths)

  if (lengths.some((len) => len === 0 || maxLen % len !== 0)) {
    throw new Error(
      `cycleInputsMultiples: payload lengths [${lengths.join(',')}] must all be >0 and divide ${maxLen}`,
    )
  }

  return Array.from(
    { length: maxLen },
    (_, i) => inputs.map((node) => node.payload[i % node.payload.length]) as RowOf<Inputs>,
  )
}

/**
 * Returns tuples of payload values, extending short inputs by repeating their last value.
 * Throws if any payload is empty.
 */
function fillLast<Inputs extends GraphNodeInputType<unknown>[]>(
  ...inputs: Inputs
): Array<RowOf<Inputs>> {
  const lengths = inputs.map((i) => i.payload.length)
  const maxLen = Math.max(...lengths)

  if (lengths.some((len) => len === 0)) {
    throw new Error(
      `cycleInputsFillLast: all payloads must be non-empty. Got lengths=[${lengths.join(',')}]`,
    )
  }

  return Array.from(
    { length: maxLen },
    (_, i) =>
      inputs.map((node) => {
        const { payload } = node
        return i < payload.length ? payload[i] : payload[payload.length - 1]
      }) as RowOf<Inputs>,
  )
}

/**
 * Zips payloads to the shortest length, trimming longer ones.
 * Returns an empty array if any payload is empty.
 */
function zipToShortest<Inputs extends GraphNodeInputType<unknown>[]>(
  ...inputs: Inputs
): Array<RowOf<Inputs>> {
  const minLen = Math.min(...inputs.map((i) => i.payload.length))

  if (minLen === 0) {
    return []
  }

  return Array.from(
    { length: minLen },
    (_, i) => inputs.map((node) => node.payload[i]) as RowOf<Inputs>,
  )
}

/**
 * Generates the Cartesian product of all payload values.
 * Returns [] if any payload is empty.
 */
function cartesianProduct<Inputs extends GraphNodeInputType<unknown>[]>(
  ...inputs: Inputs
): Array<RowOf<Inputs>> {
  if (inputs.some((i) => i.payload.length === 0)) {
    return []
  }

  let combos: unknown[][] = [[]]

  for (const node of inputs) {
    combos = combos.flatMap((tuple) => node.payload.map((value) => [...tuple, value]))
  }

  return combos as Array<RowOf<Inputs>>
}

/**
 * Returns a single tuple of values, ensuring all payloads contain exactly one item.
 * Throws if any has length ≠ 1.
 */
function singletonOnly<Inputs extends GraphNodeInputType<unknown>[]>(
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
