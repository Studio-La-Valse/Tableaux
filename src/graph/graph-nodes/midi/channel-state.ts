import { GraphNode } from '@/graph/core/graph-node'
import { GraphNodeType } from '../decorators'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
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

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    const [state, channel] = inputIterators.singletonOnly(this.inputState, this.inputChannel)

    if (!isMidiState(state)) {
      throw new Error('Provided value is not a midi state.')
    }

    const channelState = getChannelState(state, channel)
    this.outputState.next(channelState)
  }
}
