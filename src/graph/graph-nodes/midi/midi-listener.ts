import { GraphNode } from '@/graph/core/graph-node'
import { GraphNodeType } from '../decorators'
import type { InputIteratorsAsync } from '@/graph/core/input-iterators-async'
import type { MidiMessage } from '@/midi/midi-message'
import { parse } from '@/midi/midi-message'

@GraphNodeType('MIDI', 'Midi Listener')
export default class MidiListener extends GraphNode {
  private inputActive
  private output

  // Web MIDI access handle
  private midiAccess?: MIDIAccess

  // subscribed inputs
  private midiInputs = new Set<MIDIInput>()

  // buffered messages
  private missedMessages: MidiMessage[] = []

  // ensure solve is called only once per batch
  private solveScheduled = false

  constructor(id: string, path: string[]) {
    super(id, path)

    this.inputActive = this.registerBooleanInput('Active')

    this.output = this.registerObjectOutput<MidiMessage>('MIDI Message')
  }

  public override onInitialize(): void {
    super.onInitialize()
    if (!navigator.requestMIDIAccess) {
      throw new Error('This browser does not support Web MIDI API')
    }
  }

  private async start(): Promise<void> {
    // reuse an in-flight promise if present
    if (this.midiAccess) {
      return Promise.resolve()
    }

    try {
      this.midiAccess = await navigator.requestMIDIAccess()
      this.midiAccess.onstatechange = this.handleStateChange

      for (const input of this.midiAccess.inputs.values()) {
        this.addMidiInput(input)
      }
    } catch (err) {
      console.error('Failed to get MIDI access:', err)
      this.midiAccess = undefined
    }
  }

  private stop(): void {
    if (!this.midiAccess) return

    this.midiAccess.onstatechange = null
    for (const input of this.midiInputs) {
      input.onmidimessage = null
    }
    this.midiInputs.clear()
    this.midiAccess = undefined
  }

  private handleStateChange = (e: MIDIConnectionEvent) => {
    const port = e.port
    if (port?.type !== 'input') return

    const input = port as MIDIInput
    if (port.state === 'connected') {
      this.addMidiInput(input)
    } else if (port.state === 'disconnected') {
      this.removeMidiInput(input)
    }
  }

  private addMidiInput(input: MIDIInput) {
    if (this.midiInputs.has(input)) return
    input.onmidimessage = this.handleMIDIMessage
    this.midiInputs.add(input)
  }

  private removeMidiInput(input: MIDIInput) {
    input.onmidimessage = null
    this.midiInputs.delete(input)
  }

  private handleMIDIMessage = (event: MIDIMessageEvent) => {
    const msg = parse(event)
    if (msg.type === 'unknown') return

    this.missedMessages.push(msg)

    if (!this.solveScheduled) {
      this.solveScheduled = true
      // batch all incoming messages in the same tick
      setTimeout(() => {
        // trigger our solve override
        this.arm()
        this.complete()
      }, 0)
    }
  }

  protected async solve(inputIterators: InputIteratorsAsync): Promise<void> {
    const [active] = inputIterators.singletonOnly(this.inputActive)

    if (active && !this.midiAccess) {
      await this.start()
    } else if (!active && this.midiAccess) {
      this.stop()
    }

    // flush buffered messages
    for (const midiMsg of this.missedMessages) {
      this.output.next(midiMsg)
    }
    this.missedMessages.length = 0
    this.solveScheduled = false
  }
}
