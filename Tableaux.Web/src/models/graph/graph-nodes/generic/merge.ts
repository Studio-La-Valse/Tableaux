import { ConstructorNodeParamsSingle } from "../../core/constructor-node-params-single";

export class Merge extends ConstructorNodeParamsSingle<object, object> {
  protected getValue(): object[] {
    const res: object[] = [];
    this.observers.forEach(observer => {
      observer.payload.forEach(value => {
        res.push(value)
      })
    })

    return res;
  }

  public path: string[] = ["Generic", "Merge"];

}
