import { ConstructorNodeSingle } from '../../core/constructor-node-single'

export class Square extends ConstructorNodeSingle<number, number> {
  override path: string[] = ['Math', 'Square']

  protected getValue(): number[] {
    const values = this.observer.payload
    return values.map((e) => e * e)
  }
}
