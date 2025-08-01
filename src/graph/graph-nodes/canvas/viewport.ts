import { useDesignCanvasStore } from '@/stores/use-design-canvas-store'
import { GraphNode } from '../../core/graph-node'
import { watch } from 'vue'
import { GraphNodeType } from '../decorators'
import { createRectangle, type Rectangle } from '@/geometry/rectangle'

@GraphNodeType('Canvas', 'Viewport')
export class Props extends GraphNode {
  private output
  private canvasProps: { dimensions: { x: number; y: number } } | null = null
  private dimensions = { x: 0, y: 0 }

  constructor(id: string, path: string[]) {
    super(id, path)

    this.output = this.registerObjectOutput<Rectangle>('Viewport')
  }

  public onInitialize(): void {
    super.onInitialize()

    this.canvasProps = useDesignCanvasStore()

    watch(
      () => this.canvasProps?.dimensions && { ...this.canvasProps.dimensions },
      (newValue) => {
        if (!newValue) return

        this.arm()
        this.dimensions = newValue
        this.complete()
      },
      { immediate: true },
    )
  }

  protected solve(): void {
    if (!this.canvasProps) return

    const rectangle = createRectangle({ x: 0, y: 0 }, this.dimensions.x, this.dimensions.y)
    this.output.next(rectangle)
  }
}
