import { GraphNode } from '../../core/graph-node'
import { inputIterators } from '../../core/input-iterators'
import { GraphNodeType } from '../decorators'
import { type XY } from '@/models/geometry/xy'
import { deconstruct } from '@/models/geometry/line'
import type { Geometry } from '@/models/geometry/geometry'

@GraphNodeType('Geometry', 'Deconstruct Line')
export class DeconstructLine extends GraphNode {
  private inputLine

  private outputStart
  private outputEnd
  private outputLength
  private outputCenter

  constructor(id: string, path: string[]) {
    super(id, path)

    this.inputLine = this.registerObjectInput<Geometry>('Line')

    this.outputStart = this.registerObjectOutput<XY>('Start')
    this.outputEnd = this.registerObjectOutput<XY>('End')
    this.outputLength = this.registerNumberOutput('Length')
    this.outputCenter = this.registerObjectOutput<XY>('Center')
  }

  protected solve(): void {
    inputIterators.cycleValues(this.inputLine).forEach(([geom]) => {
      let start: XY
      let end: XY
      let length: number
      let center: XY

      switch (geom.kind) {
        case 'line': {
          const result = deconstruct(geom)
          start = result.start
          end = result.end
          length = result.length
          center = result.center
          break
        }
        default:
          throw new Error(`Unknown geometry type, expected 'line', got ${geom.kind}`)
      }

      this.outputStart.next(start)
      this.outputCenter.next(center)
      this.outputEnd.next(end)
      this.outputLength.next(length)
    })
  }
}
