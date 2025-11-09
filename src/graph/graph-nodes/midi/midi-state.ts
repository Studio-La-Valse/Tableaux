import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import type { MidiState as state } from '@/midi/midi-state'
import { GraphNode } from '@/graph/core/graph-node'
import { isMidiMessage } from '@/midi/midi-message'
import { update } from '@/midi/midi-state'
import { GraphNodeType } from '../decorators'

@GraphNodeType('MIDI', 'Midi State')
export default class MidiState extends GraphNode {
  private inputReset
  private inputMessages
  private outputState

  public data: state = { channels: {} }

  constructor(modelId: string) {
    super(modelId)

    this.inputReset = this.registerBooleanInput('Reset')
    this.inputMessages = this.registerObjectInput('Messages').validate((v) => {
      if (!isMidiMessage(v))
        throw new Error('Value received is not a midi message.')
      return v
    })
    this.outputState = this.registerObjectOutput<state>('MIDI State')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    const [reset] = inputIterators.singletonOnly(this.inputReset)
    if (reset) {
      this.data.channels = {}
    }

    for await (const [v] of inputIterators.cycleValues(this.inputMessages)) {
      this.data = update(this.data, v)
    }

    this.outputState.next(this.data)
  }
}
