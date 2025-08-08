import { isMidiMessage, isNoteOffOrOn } from '@/midi/midi-message'
import { GraphNode } from '../../core/graph-node'
import { inputIterators } from '../../core/input-iterators'
import { GraphNodeType } from '../decorators'

@GraphNodeType('MIDI', 'Deconstruct Note')
export class DeconstructNote extends GraphNode {
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
      if (!isNoteOffOrOn(note)) {
        if (isMidiMessage(note)) {
          return
        }

        throw new Error('Received value is not a midi message.')
      }

      this.outputChannel.next(note.channel)
      this.outputKey.next(note.key)
      this.outputVelocity.next(note.velocity)
    })
  }
}
