import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import type { JsonValue } from '@/graph/core/models/json-value'
import { GraphNode } from '@/graph/core/graph-node'
import { GraphNodeType } from '../decorators'
import { listStores, read } from './store'

@GraphNodeType('Generic', 'Store', 'Writer')
export class StoreWriter extends GraphNode {
  private name
  private input

  constructor(modelId: string) {
    super(modelId)
    this.name = this.registerStringInput('Name')
    this.input = this.registerUnknownInput('Values')
  }

  protected override async solve(iterators: InputIteratorsAsync): Promise<void> {
    const [name] = iterators.singletonOnly(this.name)
    const values: JsonValue[] = []
    for await (const value of iterators.createGenerator(this.input)) {
      values.push(value)
    }

    // Auto-initialize if store doesn't exist yet
    if (!listStores().includes(name)) {
      throw new Error('Store with name {name} does not exist! Please initialize it first.')
    }
    else {
      read(name).update(values)
    }
  }
}
