import { EmitterGraphNode } from '../../core/emitter-graph-node'

export class NumberEmitter extends EmitterGraphNode<number> {
  public static PATH = ['Emitters', 'Number']

  public path: string[] = NumberEmitter.PATH
}
