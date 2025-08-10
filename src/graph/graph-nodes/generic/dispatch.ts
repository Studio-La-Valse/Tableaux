import { GraphNode } from '../../core/graph-node'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { GraphNodeType } from '../decorators'

@GraphNodeType('Generic', 'Dispatch')
export class Dispatch extends GraphNode {
  private input1
  private input2
  private output1
  private output2

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input1 = this.registerBooleanInput('Filter')
    this.input2 = this.registerUnkownInput('Signal')
    this.output1 = this.registerUnkownOutput('Values (False)')
    this.output2 = this.registerUnkownOutput('Values (True)')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [_switch, value] of inputIterators.cycleValues(this.input1, this.input2)) {
      // true is right, false is left
      if (_switch) {
        this.output2.next(value)
      } else {
        this.output1.next(value)
      }
    }
  }
}
