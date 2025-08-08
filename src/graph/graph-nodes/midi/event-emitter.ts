import { GraphNode } from '@/graph/core/graph-node'
import { GraphNodeType } from '../decorators'
import { inputIterators } from '@/graph/core/input-iterators'
import type { MidiMessage } from '@/midi/midi-message'
import { parse } from '@/midi/midi-message'

@GraphNodeType('MIDI', 'Event Emitter')
export default class EventEmitter extends GraphNode {
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

  private startPromise?: Promise<void>

  /** Start listening if not already started */
  private start(): Promise<void> {
    // reuse an in-flight promise if present
    if (this.midiAccess) {
      return Promise.resolve()
    }
    if (this.startPromise) {
      return this.startPromise
    }

    this.startPromise = navigator
      .requestMIDIAccess()
      .then((access) => {
        this.midiAccess = access
        this.midiAccess.onstatechange = this.handleStateChange
        for (const input of access.inputs.values()) {
          this.addMidiInput(input)
        }
      })
      .catch((err) => {
        console.error('Failed to get MIDI access:', err)
        this.midiAccess = undefined
      })
      .finally(() => {
        this.startPromise = undefined
      })

    return this.startPromise
  }

  /** Stop and tear down all MIDI listeners */
  private stop(): void {
    if (!this.midiAccess) return

    this.midiAccess.onstatechange = null
    for (const input of this.midiInputs) {
      input.onmidimessage = null
    }
    this.midiInputs.clear()
    this.midiAccess = undefined
  }

  /** Handle hot-plug/unplug events */
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

  /** Subscribe to a single MIDIInput */
  private addMidiInput(input: MIDIInput) {
    if (this.midiInputs.has(input)) return
    input.onmidimessage = this.handleMIDIMessage
    this.midiInputs.add(input)
  }

  /** Unsubscribe from a single MIDIInput */
  private removeMidiInput(input: MIDIInput) {
    input.onmidimessage = null
    this.midiInputs.delete(input)
  }

  /**
   * Raw MIDI handler: buffer and schedule a single solve()
   * for a batch of messages.
   */
  private handleMIDIMessage = (event: MIDIMessageEvent) => {
    const msg = parse(event)
    if (msg.type === 'unknown') return

    this.missedMessages.push(msg)

    if (!this.solveScheduled) {
      this.solveScheduled = true
      // batch all incoming messages in the same tick
      setTimeout(() => {
        this.solveScheduled = false

        this.arm()
        this.complete()
      }, 33)
    }
  }

  /**
   * Graph solve loop:
   *  - toggles start/stop based on the 'Active' input
   *  - flushes buffered messages exactly once per batch
   */
  protected override solve(): void {
    const [active] = inputIterators.singletonOnly(this.inputActive)

    if (active && !this.midiAccess) {
      this.start()
    } else if (!active && this.midiAccess) {
      this.stop()
    }

    // flush buffered messages
    for (const midiMsg of this.missedMessages) {
      this.output.next(midiMsg)
    }
    this.missedMessages.length = 0
  }
}
