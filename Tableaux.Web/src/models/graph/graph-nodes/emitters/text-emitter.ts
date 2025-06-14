import { EmitterGraphNode } from '../../core/emitter-graph-node'

export class TextEmitter extends EmitterGraphNode<string> {
  public path: string[] = ['Emitters', 'Text']

  public value: string = "Hello, world!";

  override onInitialize(): void {
    this.next(this.value)
  }

  public onChange(newValue: string): void {
    this.arm()
    this.value = newValue
    this.next(this.value)
    this.complete()
  }
}
