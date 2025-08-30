import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { GraphNode } from '../../core/graph-node'
import { GraphNodeType } from '../decorators'

@GraphNodeType('Generic', 'Contains')
export class Includes extends GraphNode {
  private values
  private testValues
  private output

  constructor(id: string, path: string[]) {
    super(id, path)

    this.values = this.registerUnkownInput('Values')
    this.testValues = this.registerUnkownInput('Contains')
    this.output = this.registerBooleanOutput('Contains')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const v1 of inputIterators.createGenerator(this.testValues)) {
      let contains = false
      for await (const v2 of inputIterators.createGenerator(this.values)) {
        if (v1 == v2) {
          contains = true
          break
        }
      }
      this.output.next(contains)
    }
  }
}
