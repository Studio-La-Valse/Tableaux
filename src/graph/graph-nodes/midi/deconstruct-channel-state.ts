import { GraphNode } from '@/graph/core/graph-node'
import { GraphNodeType } from '../decorators'
import { inputIterators } from '@/graph/core/input-iterators'
import { isMidiChannelState } from '@/midi/midi-state'

@GraphNodeType('MIDI', 'Deconstruct Channel State')
export default class DeconstructChannelState extends GraphNode {
  private inputState
  private outputNoteVelocities
  private outputKeyPressures
  private outputControllerValues
  private outputProgram
  private outputChannelPressure
  private outputPitchBend

  constructor(id: string, path: string[]) {
    super(id, path)

    this.inputState = this.registerObjectInput('State')

    this.outputNoteVelocities = this.registerObjectOutput<{note: number, velocity: number}>('Note Velocities')
    this.outputKeyPressures = this.registerObjectOutput<{key: number, pressure: number}>('Key Pressures')
    this.outputControllerValues = this.registerObjectOutput<{controller: number, value: number}>('Controller Values')
    this.outputProgram = this.registerNumberOutput('Program')
    this.outputChannelPressure = this.registerNumberOutput('Channel Pressure')
    this.outputPitchBend = this.registerNumberOutput('Pitch Bend')
  }

  protected override solve(): void {
    inputIterators.singletonOnly(this.inputState).map((state) => {
      if (!isMidiChannelState(state)) {
        throw new Error('Provided value is not a MIDI channel state.')
      }

      // Emit notes and velocities
      for (const [note, velocity] of Object.entries(state.notes)) {
        this.outputNoteVelocities.next({note: Number(note), velocity})
      }

      // Emit keys and pressures
      for (const [key, pressure] of Object.entries(state.keyPressure)) {
        this.outputKeyPressures.next({key: Number(key), pressure})
      }

      // Emit controllers and values
      for (const [controller, value] of Object.entries(state.controllerValues)) {
        this.outputControllerValues.next({controller: Number(controller), value })
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
