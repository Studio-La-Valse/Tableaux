/* eslint-disable @typescript-eslint/no-unused-vars */

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
  if (typeof obj !== 'object' || obj === null) {
    return false
  }

  const o = obj as Record<string, unknown>

  const isRecordOfNumbers = (val: unknown): val is Record<number, number> =>
    typeof val === 'object' &&
    val !== null &&
    Object.entries(val).every(([k, v]) => !isNaN(Number(k)) && typeof v === 'number')

  return (
    isRecordOfNumbers(o.notes) &&
    isRecordOfNumbers(o.keyPressure) &&
    isRecordOfNumbers(o.controllerValues) &&
    (o.program === undefined || typeof o.program === 'number') &&
    (o.channelPressure === undefined || typeof o.channelPressure === 'number') &&
    (o.pitchBend === undefined || typeof o.pitchBend === 'number')
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
      newChannelState = {
        ...newChannelState,
        notes: {
          ...newChannelState.notes,
          [message.key]: 0, // Mark as released, but dont remove yet because that will happen only when pedal is released
        },
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

  const afterPedelState = applySustainPedalRelease(newChannelState)

  return {
    channels: {
      ...state.channels,
      [message.channel]: afterPedelState,
    },
  }
}

export function isMidiState(obj: unknown): obj is MidiState {
  if (typeof obj !== 'object' || obj === null) {
    return false
  }

  // Use a type guard to narrow obj
  const maybeState = obj as Partial<MidiState>

  if (typeof maybeState.channels !== 'object' || maybeState.channels === null) {
    return false
  }

  return Object.values(maybeState.channels).every(isMidiChannelState)
}

export function applySustainPedalRelease(channel: MidiChannelState): MidiChannelState {
  const pedalValue = channel.controllerValues[64]

  // If pedal is still down, return the original state
  if (pedalValue >= 64) {
    return channel
  }

  // Pedal released — remove notes with velocity 0
  const filteredNotes: Record<number, number> = Object.fromEntries(
    Object.entries(channel.notes)
      .filter(([_, velocity]) => velocity > 0)
      .map(([key, velocity]) => [Number(key), velocity]),
  )

  return {
    ...channel,
    notes: filteredNotes,
  }
}
