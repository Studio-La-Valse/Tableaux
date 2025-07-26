import { GraphNode } from '../../core/graph-node'
import { inputIterators } from '../../core/input-iterators'
import { GraphNodeType } from '../decorators'
import { type XY as xy } from '@/models/geometry/xy'
import { getEnd, getStart, type Line as line } from '@/models/geometry/line'

@GraphNodeType('Geometry', 'Deconstruct Line')
export class DeconstructLine extends GraphNode {
  private inputLine

  private outputStart
  private outputEnd
  private outputLength
  private outputCenter

  constructor(id: string, path: string[]) {
    super(id, path)

    this.inputLine = this.registerObjectInput<line>('Line')

    this.outputStart = this.registerObjectOutput<xy>('Start')
    this.outputEnd = this.registerObjectOutput<xy>('End')
    this.outputLength = this.registerNumberOutput('Length')
    this.outputCenter = this.registerObjectOutput<xy>('Center')
  }

  protected solve(): void {
    inputIterators.cycleValues(this.inputLine).forEach(([line]) => {
      const start = getStart(line)
      const end = getEnd(line)

      const dx = end.x - start.x
      const dy = end.y - start.y
      const length = Math.sqrt(dx * dx + dy * dy)

      const center: xy = {
        x: (start.x + end.x) / 2,
        y: (start.y + end.y) / 2,
      }

      this.outputStart.next(start)
      this.outputEnd.next(end)
      this.outputLength.next(length)
      this.outputCenter.next(center)
    })
  }
}
