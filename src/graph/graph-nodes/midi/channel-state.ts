import { GraphNode } from '@/graph/core/graph-node'
import { GraphNodeType } from '../decorators'
import { inputIterators } from '@/graph/core/input-iterators'
import { getChannelState, isMidiState, type MidiChannelState } from '@/midi/midi-state'

@GraphNodeType('MIDI', 'Channel State')
export default class ChannelState extends GraphNode {
  private inputState
  private inputChannel
  private outputState

  constructor(id: string, path: string[]) {
    super(id, path)

    this.inputState = this.registerObjectInput('State')
    this.inputChannel = this.registerNumberInput('Channel')
    this.outputState = this.registerObjectOutput<MidiChannelState>('MIDI State')
  }

  protected override solve(): void {
    const [state, channel] = inputIterators.singletonOnly(this.inputState, this.inputChannel)

    if (!isMidiState(state)){
      throw new Error("Provided value is not a midi state.")
    }

    const channelState = getChannelState(state, channel)
    this.outputState.next(channelState)
  }
}
