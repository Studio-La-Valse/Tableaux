import { inputIterators } from '@/graph/core/input-iterators'
import { GraphNode } from '../../core/graph-node'
import { GraphNodeType } from '../decorators'
import { assertIsXY, type XY } from '@/geometry/xy'

@GraphNodeType('Canvas', 'Canvas Click')
export class CanvasClick extends GraphNode {
  private output
  private active

  public override data: { value: XY; active: boolean } = { value: { x: 0, y: 0 }, active: true }

  constructor(id: string, path: string[]) {
    super(id, path)

    this.output = this.registerObjectOutput<XY>('Last Click')
    this.active = this.registerBooleanInput('Active')
  }

  public onChange(newValue: XY): void {
    this.data.value = newValue

    if (this.data.active) {
      this.arm()
      this.complete()
    }
  }

  protected solve(): void {
    const [setActive] = inputIterators.singletonOnly(this.active)
    this.data.active = setActive

    if (!this.data.value) return

    const point = assertIsXY(this.data.value)
    this.output.next(point)
  }
}
