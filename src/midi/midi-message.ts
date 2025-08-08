export type MidiMessageBase = {
  timestamp: number
  type: MessageKind
}

export type NoteOffMidiMessage = MidiMessageBase & {
  type: 'noteOff'
  channel: number
  key: number
  velocity: number
}

export type NoteOnMidiMessage = MidiMessageBase & {
  type: 'noteOn'
  channel: number
  key: number
  velocity: number
}

export type KeyPressureMidiMessage = MidiMessageBase & {
  type: 'keyPressure'
  channel: number
  key: number
  pressure: number
}

export type ControllerChangeBase = MidiMessageBase & {
  channel: number
  controllerNumber: number
  controllerValue: number
}

export type ControllerChangeMidiMessage = ControllerChangeBase & {
  type: 'controllerChange'
}

export type AllSoundOffControllerChangeMidiMessage = ControllerChangeBase & {
  type: 'allSoundOffControllerChange'
}

export type ResetAllControllersControllerChangeMidiMessage = ControllerChangeBase & {
  type: 'resetAllControllersControllerChange'
}

export type LocalControlOffControllerChangeMidiMessage = ControllerChangeBase & {
  type: 'localControlOffControllerChange'
}

export type LocalControlOnControllerChangeMidiMessage = ControllerChangeBase & {
  type: 'localControlOnControllerChange'
}

export type AllNotesOffControllerChangeMidiMessage = ControllerChangeBase & {
  type: 'allNotesOffControllerChange'
}

export type OmniModeOffControllerChangeMidiMessage = ControllerChangeBase & {
  type: 'omniModeOffControllerChange'
}

export type OmniModeOnControllerChangeMidiMessage = ControllerChangeBase & {
  type: 'omniModeOnControllerChange'
}

export type MonoModeOnControllerChangeMidiMessage = ControllerChangeBase & {
  type: 'monoModeOnControllerChange'
}

export type PolyModeOnControllerChangeMidiMessage = ControllerChangeBase & {
  type: 'polyModeOnControllerChange'
}

export type ProgramChangeMidiMessage = MidiMessageBase & {
  type: 'programChange'
  channel: number
  program: number
}

export type ChannelPressureMidiMessage = MidiMessageBase & {
  type: 'channelPressure'
  channel: number
  pressure: number
}

export type PitchBendChangeMidiMessage = MidiMessageBase & {
  type: 'pitchBendChange'
  channel: number
  pitchBend: number
}

export type UnknownMidiMessage = MidiMessageBase & {
  type: 'unknown'
}

export const messageKinds = [
  'noteOff',
  'noteOn',
  'keyPressure',
  'controllerChange',
  'allSoundOffControllerChange',
  'resetAllControllersControllerChange',
  'localControlOffControllerChange',
  'localControlOnControllerChange',
  'allNotesOffControllerChange',
  'omniModeOffControllerChange',
  'omniModeOnControllerChange',
  'monoModeOnControllerChange',
  'polyModeOnControllerChange',
  'programChange',
  'channelPressure',
  'pitchBendChange',
  'unknown',
] as const

export type MessageKind = (typeof messageKinds)[number]

export function isMessageKind(value: unknown): value is MessageKind {
  return typeof value === 'string' && messageKinds.includes(value as MessageKind)
}

export type MidiMessage =
  | UnknownMidiMessage
  | NoteOffMidiMessage
  | NoteOnMidiMessage
  | KeyPressureMidiMessage
  | ControllerChangeMidiMessage
  | AllSoundOffControllerChangeMidiMessage
  | ResetAllControllersControllerChangeMidiMessage
  | LocalControlOffControllerChangeMidiMessage
  | LocalControlOnControllerChangeMidiMessage
  | AllNotesOffControllerChangeMidiMessage
  | OmniModeOffControllerChangeMidiMessage
  | OmniModeOnControllerChangeMidiMessage
  | MonoModeOnControllerChangeMidiMessage
  | PolyModeOnControllerChangeMidiMessage
  | ProgramChangeMidiMessage
  | ChannelPressureMidiMessage
  | PitchBendChangeMidiMessage

export function isMidiMessage(value: unknown): value is MidiMessage {
  return typeof value === 'object' && value !== null && 'type' in value && isMessageKind(value.type)
}

export function isNoteOffOrOn(value: unknown): value is NoteOffMidiMessage {
  return (
    isMidiMessage(value) &&
    'channel' in value &&
    typeof value.channel === 'number' &&
    'key' in value &&
    typeof value.key === 'number' &&
    'velocity' in value &&
    typeof value.velocity === 'number'
  )
}

export function parse(event: MIDIMessageEvent): MidiMessage {
  const data = event.data
  if (!data) {
    throw new Error('Invalid midi message because it contains no data.')
  }

  const timestamp = event.timeStamp
  if (data.length < 2) {
    // no real MIDI data → unknown
    return { type: 'unknown', timestamp }
  }

  const status = data[0] & 0xf0
  const channel = (data[0] & 0x0f) + 1

  switch (status) {
    // Note Off
    case 0x80:
      return {
        type: 'noteOff',
        timestamp,
        channel,
        key: data[1] & 0x7f,
        velocity: data[2] & 0x7f,
      }

    // Note On
    case 0x90:
      return {
        type: 'noteOn',
        timestamp,
        channel,
        key: data[1] & 0x7f,
        velocity: data[2] & 0x7f,
      }

    // Polyphonic Key Pressure
    case 0xa0:
      return {
        type: 'keyPressure',
        timestamp,
        channel,
        key: data[1] & 0x7f,
        pressure: data[2] & 0x7f,
      }

    // Control Change (and all its sub-types)
    case 0xb0: {
      const controllerNumber = data[1] & 0x7f
      const controllerValue = data[2] & 0x7f

      if (controllerNumber === 120 && controllerValue === 0) {
        return {
          type: 'allSoundOffControllerChange',
          timestamp,
          channel,
          controllerNumber,
          controllerValue,
        }
      }
      if (controllerNumber === 121) {
        return {
          type: 'resetAllControllersControllerChange',
          timestamp,
          channel,
          controllerNumber,
          controllerValue,
        }
      }
      if (controllerNumber === 122) {
        if (controllerValue === 0) {
          return {
            type: 'localControlOffControllerChange',
            timestamp,
            channel,
            controllerNumber,
            controllerValue,
          }
        }
        return {
          type: 'localControlOnControllerChange',
          timestamp,
          channel,
          controllerNumber,
          controllerValue,
        }
      }
      if (controllerNumber === 123 && controllerValue === 0) {
        return {
          type: 'allNotesOffControllerChange',
          timestamp,
          channel,
          controllerNumber,
          controllerValue,
        }
      }
      if (controllerNumber === 124 && controllerValue === 0) {
        return {
          type: 'omniModeOffControllerChange',
          timestamp,
          channel,
          controllerNumber,
          controllerValue,
        }
      }
      if (controllerNumber === 125 && controllerValue === 0) {
        return {
          type: 'omniModeOnControllerChange',
          timestamp,
          channel,
          controllerNumber,
          controllerValue,
        }
      }
      if (controllerNumber === 126) {
        return {
          type: 'monoModeOnControllerChange',
          timestamp,
          channel,
          controllerNumber,
          controllerValue,
        }
      }
      if (controllerNumber === 127) {
        return {
          type: 'polyModeOnControllerChange',
          timestamp,
          channel,
          controllerNumber,
          controllerValue,
        }
      }

      return {
        type: 'controllerChange',
        timestamp,
        channel,
        controllerNumber,
        controllerValue,
      }
    }

    // Program Change
    case 0xc0:
      return {
        type: 'programChange',
        timestamp,
        channel,
        program: data[1],
      }

    // Channel Pressure
    case 0xd0:
      return {
        type: 'channelPressure',
        timestamp,
        channel,
        pressure: data[1] & 0x7f,
      }

    // Pitch Bend Change
    case 0xe0: {
      const msb = data[2] & 0x7f
      const lsb = data[1] & 0x7f
      return {
        type: 'pitchBendChange',
        timestamp,
        channel,
        pitchBend: (msb << 7) + lsb,
      }
    }

    default:
      throw new Error(`Message ${status} is undefined.`)
  }
}
