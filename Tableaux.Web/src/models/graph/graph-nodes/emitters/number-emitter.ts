import { EmitterGraphNode } from '../../core/emitter-graph-node'

export class NumberEmitter extends EmitterGraphNode<number> {

  public path: string[] = ['Emitters', 'Number']

  public value: number = 0

  override onInitialize(): void {
    this.next(this.value)
  }

  public onChange(newValue: number): void {
    this.arm()
    this.value = newValue
    this.next(this.value)
    this.complete()
  }
}
