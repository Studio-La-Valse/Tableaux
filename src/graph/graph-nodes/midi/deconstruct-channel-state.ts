import { GraphNode } from '@/graph/core/graph-node'
import { GraphNodeType } from '../decorators'
import { inputIterators } from '@/graph/core/input-iterators'
import { isMidiChannelState } from '@/midi/midi-state'

@GraphNodeType('MIDI', 'Deconstruct Channel State')
export default class DeconstructChannelState extends GraphNode {
  private inputState
  private outputNotes
  private outputVelocities
  private outputKeys
  private outputPressures
  private outputControllers
  private outputValues
  private outputProgram
  private outputChannelPressure
  private outputPitchBend

  constructor(id: string, path: string[]) {
    super(id, path)

    this.inputState = this.registerObjectInput('State')
    this.outputNotes = this.registerNumberOutput('Notes')
    this.outputVelocities = this.registerNumberOutput('Velocities')
    this.outputKeys = this.registerNumberOutput('Keys')
    this.outputPressures = this.registerNumberOutput('Pressures')
    this.outputControllers = this.registerNumberOutput('Controllers')
    this.outputValues = this.registerNumberOutput('Values')
    this.outputProgram = this.registerNumberOutput('Program')
    this.outputChannelPressure = this.registerNumberOutput('Channel Pressure')
    this.outputPitchBend = this.registerNumberOutput('Pitch Bend')
  }

  protected override solve(): void {
    inputIterators
      .singletonOnly(this.inputState)
      .map((state) => {
        if (!isMidiChannelState(state)) {
          throw new Error('Provided value is not a MIDI channel state.')
        }

        // Emit notes and velocities
        for (const [note, velocity] of Object.entries(state.notes)) {
          this.outputNotes.next(Number(note))
          this.outputVelocities.next(velocity)
        }

        // Emit keys and pressures
        for (const [key, pressure] of Object.entries(state.keyPressure)) {
          this.outputKeys.next(Number(key))
          this.outputPressures.next(pressure)
        }

        // Emit controllers and values
        for (const [controller, value] of Object.entries(state.controllerValues)) {
          this.outputControllers.next(Number(controller))
          this.outputValues.next(value)
        }

        // Emit program, channel pressure, and pitch bend
        if (state.program !== undefined) {
          this.outputProgram.next(state.program)
        }

        if (state.channelPressure !== undefined) {
          this.outputChannelPressure.next(state.channelPressure)
        }

        if (state.pitchBend !== undefined) {
          this.outputPitchBend.next(state.pitchBend)
        }
      })
  }
}
