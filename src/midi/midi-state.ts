/* eslint-disable @typescript-eslint/no-unused-vars */

import type { MidiMessage } from './midi-message';

export type MidiChannelState = {
  notes: Record<number, number>; // key -> velocity
  keyPressure: Record<number, number>; // key -> pressure
  controllerValues: Record<number, number>; // controllerNumber -> value
  sustainedNotes?: Record<number, number>; // notes not currently pressed but sustained by pedal
  program?: number;
  channelPressure?: number;
  pitchBend?: number;
};

export function isMidiChannelState(obj: unknown): obj is MidiChannelState {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  const o = obj as Record<string, unknown>;

  const isRecordOfNumbers = (val: unknown): val is Record<number, number> =>
    typeof val === 'object' &&
    val !== null &&
    Object.entries(val).every(
      ([k, v]) => !isNaN(Number(k)) && typeof v === 'number'
    );

  return (
    isRecordOfNumbers(o.notes) &&
    isRecordOfNumbers(o.keyPressure) &&
    isRecordOfNumbers(o.controllerValues) &&
    (o.sustainedNotes === undefined || isRecordOfNumbers(o.sustainedNotes)) &&
    (o.program === undefined || typeof o.program === 'number') &&
    (o.channelPressure === undefined ||
      typeof o.channelPressure === 'number') &&
    (o.pitchBend === undefined || typeof o.pitchBend === 'number')
  );
}

export type MidiState = {
  channels: Record<number, MidiChannelState>;
};

export function isMidiState(obj: unknown): obj is MidiState {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  // Use a type guard to narrow obj
  const maybeState = obj as Partial<MidiState>;

  if (typeof maybeState.channels !== 'object' || maybeState.channels === null) {
    return false;
  }

  return Object.values(maybeState.channels).every(isMidiChannelState);
}

export function getChannelState(
  state: MidiState,
  channel: number
): MidiChannelState {
  return (
    state.channels[channel] ?? {
      notes: {},
      keyPressure: {},
      controllerValues: {},
    }
  );
}

export function update(state: MidiState, message: MidiMessage): MidiState {
  if (message.type === 'unknown') return state;

  const prevChannelState = getChannelState(state, message.channel);
  const pedalPressed = prevChannelState.controllerValues[64] >= 64;

  const newChannelState: MidiChannelState = {
    ...prevChannelState,
    notes: { ...prevChannelState.notes },
    sustainedNotes: { ...prevChannelState.sustainedNotes },
    keyPressure: { ...prevChannelState.keyPressure },
    controllerValues: { ...prevChannelState.controllerValues },
  };
  if (!pedalPressed) delete newChannelState.sustainedNotes;

  switch (message.type) {
    case 'noteOn':
      newChannelState.notes[message.key] = message.velocity;
      delete newChannelState.sustainedNotes?.[message.key];
      break;

    case 'noteOff':
      if (pedalPressed) {
        newChannelState.sustainedNotes = {
          ...newChannelState.sustainedNotes,
          [message.key]: newChannelState.notes[message.key],
        };
      } else {
        delete newChannelState.notes[message.key];
      }
      break;

    case 'keyPressure':
      newChannelState.keyPressure[message.key] = message.pressure;
      break;

    case 'controllerChange':
      if (message.controllerValue > 0) {
        newChannelState.controllerValues[message.controllerNumber] =
          message.controllerValue;

        // Handle sustain pedal release
        if (message.controllerNumber === 64 && message.controllerValue < 64) {
          const sustainedKeys = Object.keys(
            newChannelState.sustainedNotes ?? {}
          ).map(Number);
          const filteredNotes: Record<number, number> = Object.fromEntries(
            Object.entries(newChannelState.notes).filter(
              ([k]) => !sustainedKeys.includes(Number(k))
            )
          );
          newChannelState.notes = filteredNotes;
          delete newChannelState.sustainedNotes;
        }
      } else {
        const { [message.controllerNumber]: _, ...rest } =
          newChannelState.controllerValues;
        newChannelState.controllerValues = rest;
      }
      break;

    case 'programChange':
      newChannelState.program = message.program;
      break;

    case 'channelPressure':
      newChannelState.channelPressure = message.pressure;
      break;

    case 'pitchBendChange':
      newChannelState.pitchBend = message.pitchBend;
      break;
  }

  return {
    channels: {
      ...state.channels,
      [message.channel]: newChannelState,
    },
  };
}
