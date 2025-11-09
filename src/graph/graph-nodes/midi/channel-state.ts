import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import type { MidiChannelState } from '@/midi/midi-state'
import { GraphNode } from '@/graph/core/graph-node'
import { getChannelState, isMidiState } from '@/midi/midi-state'
import { GraphNodeType } from '../decorators'

@GraphNodeType('MIDI', 'Channel State')
export default class ChannelState extends GraphNode {
  private inputState
  private inputChannel
  private outputState

  constructor(modelId: string) {
    super(modelId)

    this.inputState = this.registerObjectInput('State').validate((v) => {
      if (!isMidiState(v)) {
        throw new Error('Provided value is not a midi state.')
      }
      return v
    })
    this.inputChannel = this.registerNumberInput('Channel')
    this.outputState = this.registerObjectOutput<MidiChannelState>('MIDI State')
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    const [state, channel] = inputIterators.singletonOnly(this.inputState, this.inputChannel)

    const channelState = getChannelState(state, channel)
    this.outputState.next(channelState)
  }
}
