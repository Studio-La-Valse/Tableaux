import { GraphNode } from '../../core/graph-node'
import { inputIterators } from '../../core/input-iterators'
import { GraphNodeType } from '../decorators'
import { type XY as xy } from '@/models/geometry/xy'
import { deconstruct, type Line as line } from '@/models/geometry/line'

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
      const { start, center, end, length } = deconstruct(line)

      this.outputStart.next(start)
      this.outputCenter.next(center)
      this.outputEnd.next(end)
      this.outputLength.next(length)
    })
  }
}
