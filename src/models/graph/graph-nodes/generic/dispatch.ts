import { GraphNode } from '../../core/graph-node'
import { inputIterators } from '../../core/input-iterators'

export class Dispatch extends GraphNode {
  private input1
  private input2
  private output1
  private output2

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input1 = this.registerBooleanInput("Filter")
    this.input2 = this.registerUnkownInput("Signal")
    this.output1 = this.registerUnkownOutput("Values (False)")
    this.output2 = this.registerUnkownOutput("Values (True)")
  }

  protected solve(): void {
    inputIterators
      .cycleValues(this.input1, this.input2)
      .map(([_switch, value]) => {
        // true is right, false is left
        if (_switch){
          this.output2.next(value)
        } else {
          this.output1.next(value)
        }
      })
  }
}
