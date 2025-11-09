import type { XY as xy } from '@/geometry/xy'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { GraphNode } from '@/graph/core/graph-node'
import { GraphNodeType } from '../../decorators'

@GraphNodeType('Geometry', 'Vector', 'Construct XY')
export class XY extends GraphNode {
  private input1
  private input2
  private output

  constructor(modelId: string) {
    super(modelId)

    this.input1 = this.registerNumberInput('X')
    this.input2 = this.registerNumberInput('Y')
    this.output = this.registerObjectOutput<xy>('XY')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [x, y] of inputIterators.cycleValues(this.input1, this.input2)) {
      this.output.next({ x, y })
    }
  }
}
