import { GraphNode } from '@/graph/core/graph-node'
import { GraphNodeType } from '../decorators'
import { inputIterators } from '@/graph/core/input-iterators'

@GraphNodeType('JSON', 'Property')
export default class Property extends GraphNode {
  private inputObject
  private inputProperty
  private outputValue

  constructor(id: string, path: string[]) {
    super(id, path)

    this.inputObject = this.registerObjectInput('Object')
    this.inputProperty = this.registerStringInput('Property')
    this.outputValue = this.registerUnkownOutput('Value')
  }

  protected async solve(): Promise<void> {
    inputIterators
      .cycleValues(this.inputObject, this.inputProperty)
      .map(([o, p]) => {
        const result = o[p]
        if (result === undefined)
          throw new Error(`Property '${p}' not found in object '${JSON.stringify(o)}'`)
        return result
      })
      .forEach((v) => this.outputValue.next(v))
  }
}
