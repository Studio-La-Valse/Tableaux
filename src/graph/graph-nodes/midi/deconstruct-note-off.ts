import { isMidiMessage, isNoteOff } from '@/midi/midi-message'
import { GraphNode } from '../../core/graph-node'
import { inputIterators } from '../../core/input-iterators'
import { GraphNodeType } from '../decorators'

@GraphNodeType('MIDI', 'Deconstruct Note Off')
export class DeconstructNoteOff extends GraphNode {
  private inputNote

  private outputChannel
  private outputKey
  private outputVelocity

  constructor(id: string, path: string[]) {
    super(id, path)

    this.inputNote = this.registerObjectInput('Midi Message')

    this.outputChannel = this.registerNumberOutput('Channel')
    this.outputKey = this.registerNumberOutput('Key')
    this.outputVelocity = this.registerNumberOutput('Velocity')
  }

  protected solve(): void {
    inputIterators.cycleValues(this.inputNote).forEach(([note]) => {
      if (!isMidiMessage(note)) {
        throw new Error('Received value is not a midi message.')
      }

      if (!isNoteOff(note)) return

      this.outputChannel.next(note.channel)
      this.outputKey.next(note.key)
      this.outputVelocity.next(note.velocity)
    })
  }
}
