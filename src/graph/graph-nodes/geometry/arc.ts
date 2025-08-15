import { GraphNode } from '../../core/graph-node'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { GraphNodeType } from '../decorators'
import { assertIsXY } from '@/geometry/xy'
import { createArc, type Arc as arc } from '@/geometry/arc'

@GraphNodeType('Geometry', 'Arc')
export class Arc extends GraphNode {
  private input1
  private input2
  private input3
  private input4
  private input5
  private outputCircle

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input1 = this.registerObjectInput('XY').validate(assertIsXY)
    this.input2 = this.registerNumberInput('Radius')
    this.input3 = this.registerNumberInput('Start Angle')
    this.input4 = this.registerNumberInput('End Angle')
    this.input5 = this.registerBooleanInput('Clockwise')

    this.outputCircle = this.registerObjectOutput<arc>('Circle')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [xy, radius, start, end, clockwise] of inputIterators.cycleValues(
      this.input1,
      this.input2,
      this.input3,
      this.input4,
      this.input5,
    )) {
      const arc = createArc(xy, radius, start, end, clockwise)
      this.outputCircle.next(arc)
    }
  }
}
