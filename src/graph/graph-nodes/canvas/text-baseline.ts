import { GraphNode } from '@/graph/core/graph-node';
import { GraphNodeType } from '../decorators';

@GraphNodeType('Canvas', 'Text Baseline')
export class TextBaseline extends GraphNode {
  private top;
  private hanging;
  private middle;
  private alphabetic;
  private ideographic;
  private bottom;

  constructor(id: string, path: string[]) {
    super(id, path);

    this.top = this.registerStringOutput('Top');
    this.hanging = this.registerStringOutput('Hanging');
    this.middle = this.registerStringOutput('Middle');
    this.alphabetic = this.registerStringOutput('Alphabetic');
    this.ideographic = this.registerStringOutput('Ideographic');
    this.bottom = this.registerStringOutput('Bottom');
  }

  protected async solve(): Promise<void> {
    this.top.next('top');
    this.hanging.next('hanging');
    this.middle.next('middle');
    this.alphabetic.next('alphabetic');
    this.ideographic.next('ideographic');
    this.bottom.next('bottom');
  }
}
