import { GraphNode } from '@/graph/core/graph-node'
import { GraphNodeType } from '../decorators'

@GraphNodeType('Canvas', 'Text Alignment')
export class TextAlginment extends GraphNode {
  private start
  private end
  private left
  private right
  private center

  constructor(id: string, path: string[]) {
    super(id, path)

    this.start = this.registerStringOutput("Start")
    this.end = this.registerStringOutput("End")
    this.left = this.registerStringOutput("Left")
    this.right = this.registerStringOutput("Right")
    this.center = this.registerStringOutput("Center")
  }

  protected solve(): void {
    this.start.next('start')
    this.end.next('end')
    this.left.next('left')
    this.right.next('right')
    this.center.next('center')
  }
}
