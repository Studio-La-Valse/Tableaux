import { useCanvasElementStore } from '@/stores/canvas-element-store'
import { GraphNode } from '../../core/graph-node'
import type { DrawableElement } from '@/models/drawable-elements/drawable-element'

export class Canvas extends GraphNode {
  private input
  private elementStore: { elements: DrawableElement[] } | null

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input = this.registerObjectInput()
    this.elementStore = null
  }

  override onInitialize(): void {
    super.onInitialize()

    this.elementStore = useCanvasElementStore()
  }

  public arm(): void {
    if (this.elementStore !== null) {
      this.elementStore.elements.length = 0
    }

    super.arm()
  }

  protected solve(): void {
    this.input.payload.forEach((p) => this.elementStore?.elements.push(p))
  }
}
