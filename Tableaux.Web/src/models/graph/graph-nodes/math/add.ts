import { ConstructorNodeDouble } from '../../core/constructor-node-double'

export class Add extends ConstructorNodeDouble<number, number, number> {
  protected getValue(): number[] {
    const first = this.observer1.payload
    const second = this.observer2.payload

    const max = Math.max(first.length, second.length)
    const resArr = []

    for (let index = 0; index < max; index++) {
      const left = first[index % first.length]
      const right = second[index % second.length]
      const res = left + right
      resArr.push(res)
    }

    return resArr
  }

  public path: string[] = ['Math', 'Add']
}
