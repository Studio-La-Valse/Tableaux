import type { JsonValue } from '@/graph/core/models/json-value'
import { GraphNodeType } from '../decorators'
import { GraphNode } from '@/graph/core/graph-node'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'

const stores = new Map<string, ReturnType<typeof createStore>>()

function createStore(initialData: JsonValue[]) {
  const data: JsonValue[] = [...initialData]
  const update = (values: JsonValue[]) => {
    data.length = 0
    for (const value of values) {
      data.push(value)
    }
  }
  return { data, update }
}

export function read(name: string) {
  const store = stores.get(name)
  if (!store) {
    throw Error(`Cannot find store ${name}`)
  }

  return store
}

export function initialize(name: string, initialData: JsonValue[]) {
  if (!stores.has(name)) {
    stores.set(name, createStore(initialData))
  }
  const store = stores.get(name)!
  store?.update(initialData)
  return store
}

@GraphNodeType('Generic', 'Store', 'Reader')
export class StoreReader extends GraphNode {
  private name
  private initial
  private reset
  private trigger
  private output

  constructor(id: string, path: string[]) {
    super(id, path)

    this.name = this.registerStringInput('Name')
    this.initial = this.registerUnkownInput('Initial')
    this.reset = this.registerBooleanInput('Reset')
    this.trigger = this.registerUnkownInput('Trigger')
    this.output = this.registerUnkownOutput('Values')
  }

  protected override async solve(iterators: InputIteratorsAsync): Promise<void> {
    const [name, reset] = iterators.singletonOnly(this.name, this.reset)

    let store
    if (reset) {
      const initialData = []

      for await (const value of iterators.createGenerator(this.initial)) {
        initialData.push(value)
      }

      store = initialize(name, initialData)
    } else {
      store = read(name)
    }

    for (const value of store.data) {
      this.output.next(value)
    }
  }
}

@GraphNodeType('Generic', 'Store', 'Writer')
export class StoreWriter extends GraphNode {
  private name
  private input

  constructor(id: string, path: string[]) {
    super(id, path)

    this.name = this.registerStringInput('Name')
    this.input = this.registerUnkownInput('Values')
  }

  protected override async solve(iterators: InputIteratorsAsync): Promise<void> {
    const [name] = iterators.singletonOnly(this.name)
    const values: JsonValue[] = []
    for await (const value of iterators.createGenerator(this.input)) {
      values.push(value)
    }
    read(name).update(values)
  }
}
