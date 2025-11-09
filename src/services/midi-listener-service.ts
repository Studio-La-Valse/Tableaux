export class MidiListenerService {
  private midiAccess: MIDIAccess | null = null;
  private listeners: Set<(message: MIDIMessageEvent) => void> = new Set();

  async initMIDI(): Promise<void> {
    try {
      this.midiAccess = await navigator.requestMIDIAccess();
    } catch (error) {
      console.error('Failed to access MIDI:', error);
      throw error;
    }
  }

  startListening(callback: (message: MIDIMessageEvent) => void): void {
    if (!this.midiAccess) {
      console.warn('MIDI access not initialized.');
      return;
    }

    this.listeners.add(callback);

    this.midiAccess.inputs.forEach((input) => input.addEventListener('midimessage', callback));
  }

  stopListening(): void {
    if (!this.midiAccess) return;

    this.listeners.forEach((callback) => {
      this.midiAccess!.inputs.forEach((input) =>
        input.removeEventListener('midimessage', callback),
      );
    });

    this.listeners.clear();
  }

  cleanup(): void {
    if (!this.midiAccess) return;

    this.stopListening();

    this.midiAccess.inputs.forEach((input) => input.close());
    this.midiAccess.outputs.forEach((output) => output.close());

    this.midiAccess = null;
  }
}
