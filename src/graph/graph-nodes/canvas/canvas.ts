import { useDesignCanvasStore } from '@/stores/use-design-canvas-store'
import { GraphNode } from '../../core/graph-node'
import { GraphNodeType } from '../decorators'
import { assertIsShape, type Shape } from '@/geometry/shape'

@GraphNodeType('Canvas', 'Canvas')
export class Canvas extends GraphNode {
  private input
  private elementStore: { setElements: (e: Shape[]) => void; redraw: () => void } | null

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input = this.registerObjectInput('Drawable Elements')
    this.elementStore = null
  }

  override onInitialize(): void {
    super.onInitialize()

    this.elementStore = useDesignCanvasStore()
  }

  public arm(): void {
    this.elementStore?.setElements([])

    super.arm()
  }

  protected async solve(): Promise<void> {
    this.elementStore?.setElements(this.input.payload.map((v) => assertIsShape(v)))
    this.elementStore?.redraw()
  }

  public onDestroy(): void {
    super.onDestroy()

    this.elementStore?.setElements([])
    this.elementStore?.redraw()
  }
}
