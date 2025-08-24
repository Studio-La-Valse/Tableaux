import { GraphNode } from '@/graph/core/graph-node'
import { GraphNodePanel, GraphNodeType } from '../decorators'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { assertIsShape } from '@/geometry/shape'
import PreviewPanel from '@/components/graph/Panels/PreviewPanel.vue'
import { BitmapPainter } from '@/bitmap-painters/bitmap-painter'
import { useDesignCanvasStore } from '@/stores/use-design-canvas-store'

@GraphNodeType('Geometry', 'Preview')
@GraphNodePanel(PreviewPanel)
export class Preview extends GraphNode {
  private input

  private canvas: HTMLCanvasElement | null = null

  constructor(id: string, path: string[]) {
    super(id, path)

    this.input = this.registerObjectInput('Geometry').validate(assertIsShape)
  }

  public setCanvas(canvas: HTMLCanvasElement | null) {
    this.canvas = canvas
    if (canvas) {
      this.arm()
      this.complete()
    }
  }

  override arm(): void {
    super.arm()

    // The first arm may fail because a canvas may be set after initialization. No problem.
    this.getPainter()?.finish()
  }

  protected override async solve(iterators: InputIteratorsAsync): Promise<void> {
    const painter = this.getPainter()
    if (!painter) return

    for await (const e of iterators.createGenerator(this.input)) {
      painter.draw(e)
    }

    painter.finish()
  }

  public onDestroy(): void {
    super.onDestroy()

    // Same as arm, no problem if painter couldn't be initialized.
    this.getPainter()?.finish()
  }

  private getPainter(): BitmapPainter | null {
    const { dimensions } = useDesignCanvasStore()
    if (!this.canvas) {
      return null
    }

    const painter = BitmapPainter.init(this.canvas, dimensions.x, dimensions.y)
    return painter
  }
}
