import { GraphNode } from '../../core/graph-node'
import { inputIterators } from '../../core/input-iterators'
import { GraphNodeType } from '../decorators'

@GraphNodeType('Generic', 'Switch')
export class Switch extends GraphNode {
  private input1
  private params
  private output

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input1 = this.registerNumberInput('Filter')
    this.params = this.registerUnkownInputParams('Signal')
    this.output = this.registerUnkownOutput('Values')
  }

  protected async solve(): Promise<void> {
    inputIterators
      .cycleValues(this.input1, ...this.params)
      .map(([value, ...values]) => values[value])
      .forEach((v) => this.output.next(v))
  }
}
