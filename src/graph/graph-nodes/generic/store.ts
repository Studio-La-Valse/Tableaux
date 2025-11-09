import type { JsonValue } from '@/graph/core/models/json-value'

export type Store = {
  data: JsonValue[]
  update: (values: JsonValue[]) => void
}

const stores = new Map<string, Store>()

function createStore(initialData: JsonValue[] = []): Store {
  let data: JsonValue[] = [...initialData]
  const update = (values: JsonValue[]) => {
    data = [...values] // replace reference for clarity
  }
  return {
    get data() {
      return data
    },
    update,
  }
}

// --- Store API ---
export function read(name: string): Store {
  const store = stores.get(name)
  if (!store) {
    throw new Error(`Cannot find store "${name}"`)
  }
  return store
}

export function initialize(name: string, initialData: JsonValue[] = []): Store {
  const existing = stores.get(name)
  if (existing) {
    existing.update(initialData)
    return existing
  }
  const newStore = createStore(initialData)
  stores.set(name, newStore)
  return newStore
}

export function clearStore(name: string): boolean {
  return stores.delete(name)
}

export function listStores(): string[] {
  return Array.from(stores.keys())
}

export function deleteStore(name: string): boolean {
  return stores.delete(name)
}
