import { GraphNode } from '../../core/graph-node'
import { GraphNodeType } from '../decorators'
import { assertIsXY, type XY } from '@/geometry/xy'

@GraphNodeType('Canvas', 'Mouse Move')
export class MouseMove extends GraphNode {
  private output

  constructor(id: string, path: string[]) {
    super(id, path)

    this.output = this.registerObjectOutput<XY>('Last Position')
  }

  public onChange(newValue: XY): void {
    this.arm()
    this.data.value = newValue
    this.complete()
  }

  protected solve(): void {
    if (!this.data.value) return

    const point = assertIsXY(this.data.value)
    this.output.next(point)
  }
}
