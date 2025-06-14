import { ref, type Ref } from 'vue'
import { LeafGraphNode } from '../../core/leaf-graph-node'

export class Logger extends LeafGraphNode<string> {
  public values: Ref<string[]> = ref([])
  public path: string[] = ['Generic', 'Logger']

  public onComplete(values: string[]): void {
    console.log(values.join(', '))
    this.values.value = [...values]
  }
}
