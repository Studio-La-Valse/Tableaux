import { GraphNode } from '@/graph/core/graph-node'
import { GraphNodeType } from '../decorators'

@GraphNodeType('Canvas', 'Text Direction')
export class TextDirection extends GraphNode {
  private ltr
  private rtl
  private inherit

  constructor(id: string, path: string[]) {
    super(id, path)

    this.ltr = this.registerStringOutput('LTR')
    this.rtl = this.registerStringOutput('RIL')
    this.inherit = this.registerStringOutput('Inherit')
  }

  protected async solve(): Promise<void> {
    this.ltr.next('ltr')
    this.rtl.next('rtl')
    this.inherit.next('inherit')
  }
}
