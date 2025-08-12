import { GraphNode } from '@/graph/core/graph-node'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { GraphNodeType } from '@/graph/graph-nodes/decorators'
import { assertIsGeometry, scaleUniform, type Geometry } from '@/geometry/geometry'
import { assertIsXY } from '@/geometry/xy'

@GraphNodeType('Geometry', 'Transform', 'Scale (Uniform)')
export class ScaleGeometry extends GraphNode {
  private inputGeometry
  private inputCenter
  private inputFactor

  private outputGeometry

  constructor(id: string, path: string[]) {
    super(id, path)

    this.inputGeometry = this.registerObjectInput('Geometry').validate(assertIsGeometry)
    this.inputCenter = this.registerObjectInput('Center').validate(assertIsXY)
    this.inputFactor = this.registerNumberInput('Scale Factor X')

    this.outputGeometry = this.registerObjectOutput<Geometry>('Scaled Geometry')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    for await (const [geom, origin, factor] of inputIterators.cycleValues(
      this.inputGeometry,
      this.inputCenter,
      this.inputFactor,
    )) {
      const scaled = scaleUniform(geom, origin, factor)
      this.outputGeometry.next(scaled)
    }
  }
}
