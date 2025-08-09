import { GraphNode } from '@/graph/core/graph-node'
import { GraphNodeType } from '../decorators'
import { inputIterators } from '@/graph/core/input-iterators'
import { update, type MidiState as state } from '@/midi/midi-state'
import { isMidiMessage } from '@/midi/midi-message'

@GraphNodeType('MIDI', 'Midi State')
export default class MidiState extends GraphNode {
  private inputReset
  private inputMessages
  private outputState

  public data: state = { channels: {} }

  constructor(id: string, path: string[]) {
    super(id, path)

    this.inputReset = this.registerBooleanInput('Reset')
    this.inputMessages = this.registerObjectInput('Messages')
    this.outputState = this.registerObjectOutput<state>('MIDI State')
  }

  protected async solve(): Promise<void> {
    const [reset] = inputIterators.singletonOnly(this.inputReset)
    if (reset) {
      this.data['channels'] = {}
    }

    inputIterators.cycleValues(this.inputMessages).forEach(([v]) => {
      if (!isMidiMessage(v)) throw new Error('Value received is not a midi message.')

      this.data = update(this.data, v)
    })

    this.outputState.next(this.data)
  }
}
