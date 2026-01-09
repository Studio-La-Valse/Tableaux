import type { Ellipse as _Ellipse } from '@/geometry/primitives/ellipse'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { xyOps } from '@/geometry/primitives/xy-ops'
import { GraphNode } from '../../../core/graph-node'
import { GraphNodeType } from '../../decorators'

@GraphNodeType('Geometry', 'Surface', 'Construct Ellipse')
export class Ellipse extends GraphNode {
  private input1
  private input2
  private input3
  private input4
  private output

  constructor(modelId: string) {
    super(modelId)

    this.input1 = this.registerObjectInput('XY').validate(xyOps.cast)
    this.input2 = this.registerNumberInput('Radius X')
    this.input3 = this.registerNumberInput('Radius Y')
    this.input4 = this.registerNumberInput('Rotation')

    this.output = this.registerObjectOutput<_Ellipse>('Circle')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [xy, radiusX, radiusY, rotation] of inputIterators.cycleValues(
      this.input1,
      this.input2,
      this.input3,
      this.input4,
    )) {
      const ellipse = { ...xy, radiusX, radiusY, rotation }
      this.output.next(ellipse)
    }
  }
}
