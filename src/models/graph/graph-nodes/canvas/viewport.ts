import { useCanvasPropsStore } from '@/stores/use-canvas-props-store'
import { GraphNode } from '../../core/graph-node'
import { watch } from 'vue'
import { GraphNodeType } from '../decorators'
import type { Rectangle } from '@/models/geometry/rectangle'

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

    this.canvasProps = useCanvasPropsStore()

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

    this.output.next({
      topLeft: { x: 0, y: 0 },
      width: this.dimensions.x,
      height: this.dimensions.y,
    })
  }
}
