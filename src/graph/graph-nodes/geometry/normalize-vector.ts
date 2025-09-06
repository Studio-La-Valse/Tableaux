import { GraphNode } from '../../core/graph-node'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { GraphNodeType } from '../decorators'
import { assertIsXY, normalize, type XY as xy } from '@/geometry/xy'

@GraphNodeType('Geometry', 'Normalize Vector')
export class NormalizeVector extends GraphNode {
  private xy
  private output

  constructor(id: string, path: string[]) {
    super(id, path)

    this.xy = this.registerObjectInput('XY').validate((v) => assertIsXY(v))
    this.output = this.registerObjectOutput<xy>('XY')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [xy] of inputIterators.cycleValues(this.xy)) {
      const {x, y} = normalize(xy)

      this.output.next({ x, y })
    }
  }
}
