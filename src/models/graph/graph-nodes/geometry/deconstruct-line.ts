import { GraphNode } from '../../core/graph-node'
import { inputIterators } from '../../core/input-iterators'
import { GraphNodeType } from '../decorators'
import { type XY } from '@/models/geometry/xy'
import { deconstruct } from '@/models/geometry/line'
import { assertIsShape, isOfShapeKind } from '@/models/geometry/geometry'

@GraphNodeType('Geometry', 'Deconstruct Line')
export class DeconstructLine extends GraphNode {
  private inputLine

  private outputStart
  private outputEnd
  private outputLength
  private outputCenter

  constructor(id: string, path: string[]) {
    super(id, path)

    this.inputLine = this.registerObjectInput('Line')

    this.outputStart = this.registerObjectOutput<XY>('Start')
    this.outputEnd = this.registerObjectOutput<XY>('End')
    this.outputLength = this.registerNumberOutput('Length')
    this.outputCenter = this.registerObjectOutput<XY>('Center')
  }

  protected solve(): void {
    inputIterators.cycleValues(this.inputLine).forEach(([_geom]) => {
      const geom = assertIsShape(_geom)

      if (!isOfShapeKind(geom, ['line', 'arc', 'elliptical-arc'])) {
        throw new Error(
          `Unknown geometry type, expected 'line', 'arc' or 'elliptical-arc', got ${geom.kind}`,
        )
      }

      const { start, middle: center, end, length } = deconstruct(geom)

      this.outputStart.next(start)
      this.outputCenter.next(center)
      this.outputEnd.next(end)
      this.outputLength.next(length)
    })
  }
}
