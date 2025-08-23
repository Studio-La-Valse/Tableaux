import { GraphNode } from '@/graph/core/graph-node'
import { GraphNodePanel, GraphNodeType } from '../decorators'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import { assertIsShape } from '@/geometry/shape'
import PreviewPanel from '@/components/graph/Panels/PreviewPanel.vue'
import { BitmapPainter } from '@/bitmap-painters/bitmap-painter'

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
  }

  protected override async solve(iterators: InputIteratorsAsync): Promise<void> {
    if (!this.canvas) {
      return await Promise.reject("Canvas has not been set.")
    }

    const ctx = this.canvas.getContext("2d")
    if (!ctx) {
      return await Promise.reject("Cannot create 2d context from canvas.")
    }

    const painter = new BitmapPainter(ctx)
    painter.Init(this.canvas.width, this.canvas.height)

    for await (const e of iterators.createGenerator(this.input)) {
      painter.DrawElement(e)
    }

    painter.Finish()
  }
}
