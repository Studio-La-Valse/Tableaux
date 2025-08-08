import type { MidiMessage } from './midi-message'

export type MidiChannelState = {
  notes: Record<number, number> // key -> velocity
  keyPressure: Record<number, number> // key -> pressure
  controllerValues: Record<number, number> // controllerNumber -> value
  program?: number
  channelPressure?: number
  pitchBend?: number
}

export function isMidiChannelState(obj: unknown): obj is MidiChannelState {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'notes' in obj &&
    'keyPressure' in obj &&
    'controllerValues' in obj &&
    'program' in obj &&
    'channelPressure' in obj &&
    'pitchBend' in obj &&
    typeof obj.notes === 'object' &&
    typeof obj.keyPressure === 'object' &&
    typeof obj.controllerValues === 'object' &&
    typeof obj.program === 'number' &&
    typeof obj.channelPressure === 'number' &&
    typeof obj.pitchBend === 'number'
  )
}

export type MidiState = {
  channels: Record<number, MidiChannelState>
}

export function getChannelState(state: MidiState, channel: number): MidiChannelState {
  return (
    state.channels[channel] ?? {
      notes: {},
      keyPressure: {},
      controllerValues: {},
    }
  )
}

export function update(state: MidiState, message: MidiMessage): MidiState {
  if (message.type === 'unknown') return state

  const prevChannelState = getChannelState(state, message.channel)

  let newChannelState: MidiChannelState = { ...prevChannelState }

  switch (message.type) {
    case 'noteOn':
      newChannelState = {
        ...newChannelState,
        notes: {
          ...newChannelState.notes,
          [message.key]: message.velocity,
        },
      }
      break

    case 'noteOff': {
      const { [message.key]: _, ...newNotes } = newChannelState.notes
      newChannelState = {
        ...newChannelState,
        notes: newNotes,
      }
      break
    }

    case 'keyPressure':
      newChannelState = {
        ...newChannelState,
        keyPressure: {
          ...newChannelState.keyPressure,
          [message.key]: message.pressure,
        },
      }
      break

    case 'controllerChange':
      newChannelState = {
        ...newChannelState,
        controllerValues: {
          ...newChannelState.controllerValues,
          [message.controllerNumber]: message.controllerValue,
        },
      }
      break

    case 'programChange':
      newChannelState = {
        ...newChannelState,
        program: message.program,
      }
      break

    case 'channelPressure':
      newChannelState = {
        ...newChannelState,
        channelPressure: message.pressure,
      }
      break

    case 'pitchBendChange':
      newChannelState = {
        ...newChannelState,
        pitchBend: message.pitchBend,
      }
      break
  }

  return {
    channels: {
      ...state.channels,
      [message.channel]: newChannelState,
    },
  }
}

export function isMidiState(obj: unknown): obj is MidiState {
  if (typeof obj !== 'object' || obj === null) return false

  // Check that all values are valid MidiChannelState objects
  return Object.values(obj).every(isMidiChannelState)
}
