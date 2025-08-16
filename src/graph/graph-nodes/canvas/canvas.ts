import { useDesignCanvasStore } from '@/stores/use-design-canvas-store'
import { GraphNode } from '../../core/graph-node'
import { GraphNodeType } from '../decorators'
import { assertIsShape, type Shape } from '@/geometry/shape'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'

@GraphNodeType('Canvas', 'Canvas')
export class Canvas extends GraphNode {
  private input
  private elementStore: { setElements: (e: Shape[]) => void; redraw: () => void } | null

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input = this.registerObjectInput('Drawable Elements').validate(assertIsShape)
    this.elementStore = null
  }

  override onInitialize(): void {
    super.onInitialize()

    this.elementStore = useDesignCanvasStore()
  }

  public arm(): void {
    super.arm()

    this.elementStore?.setElements([])
    this.elementStore?.redraw()
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    const arr: Shape[] = []
    for await (const [v] of inputIterators.cycleValues(this.input)) {
      arr.push(v)
    }
    this.elementStore?.setElements(arr)
    this.elementStore?.redraw()
  }

  public onDestroy(): void {
    super.onDestroy()

    this.elementStore?.setElements([])
    this.elementStore?.redraw()
  }
}
