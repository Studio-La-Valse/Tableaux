import { useCanvasProps } from '@/stores/canvas-props-store'
import { GraphNode } from '../../core/graph-node'
import { watch } from 'vue'

export class CanvasProps extends GraphNode {
  private output1
  private output2
  private canvasProps: { dimensions: { x: number; y: number } } | null = null
  private dimensions = { x: 0, y: 0 }

  constructor(id: string, path: string[]) {
    super(id, path)

    this.output1 = this.registerNumberOutput()
    this.output2 = this.registerNumberOutput()
  }

  public onInitialize(): void {
    super.onInitialize()

    this.canvasProps = useCanvasProps()

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

    this.output1.next(this.dimensions.x)
    this.output2.next(this.dimensions.y)
  }
}
