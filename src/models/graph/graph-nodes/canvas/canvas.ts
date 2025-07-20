import { useCanvasElementStore } from '@/stores/use-canvas-element-store'
import { GraphNode } from '../../core/graph-node'
import { GraphNodeType } from '../decorators'
import { type DrawableGeometry } from '@/models/geometry/geometry'

@GraphNodeType('Canvas', 'Canvas')
export class Canvas extends GraphNode {
  private input
  private elementStore: { setElements: (e: DrawableGeometry[]) => void } | null

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input = this.registerObjectInput<DrawableGeometry>('Drawable Elements')
    this.elementStore = null
  }

  override onInitialize(): void {
    super.onInitialize()

    this.elementStore = useCanvasElementStore()
  }

  public arm(): void {
    if (this.elementStore !== null) {
      this.elementStore.setElements([])
    }

    super.arm()
  }

  protected solve(): void {
    this.elementStore?.setElements(this.input.payload)
  }

  public onDestroy(): void {
    super.onDestroy()

    this.elementStore?.setElements([])
  }
}
