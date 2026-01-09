import type { Arc as _Arc } from '@/geometry/primitives/arc'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { assertIsXY } from '@/geometry/primitives/xy'
import { GraphNode } from '@/graph/core/graph-node'
import { GraphNodeType } from '../../decorators'

@GraphNodeType('Geometry', 'Curve', 'Construct Arc')
export class Arc extends GraphNode {
  private input1
  private input2
  private input3
  private input4
  private input5
  private outputCircle

  constructor(modelId: string) {
    super(modelId)

    this.input1 = this.registerObjectInput('XY').validate(assertIsXY)
    this.input2 = this.registerNumberInput('Radius')
    this.input3 = this.registerNumberInput('Start Angle')
    this.input4 = this.registerNumberInput('End Angle')
    this.input5 = this.registerBooleanInput('Clockwise', [false])

    this.outputCircle = this.registerObjectOutput<_Arc>('Circle')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [xy, radius, startAngle, endAngle, clockwise] of inputIterators.cycleValues(
      this.input1,
      this.input2,
      this.input3,
      this.input4,
      this.input5,
    )) {
      const arc = { ...xy, radius, startAngle, endAngle, counterclockwise: !clockwise }
      this.outputCircle.next(arc)
    }
  }
}
