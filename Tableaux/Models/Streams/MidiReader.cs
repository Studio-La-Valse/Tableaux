using NAudio.Midi;
using System.Collections.Generic;
using Tableaux.API;

namespace Tableaux.Models.Streams
{
    public class MidiReader : IMidiProvider
    {

        private readonly IReadOnlyList<MidiEvent> midiEvents;
        private readonly int ticksPerMilisecond;
        private readonly Clock clock;
        private double readerTicks;
        private int currentLineIndex;

        public MidiReader(IReadOnlyList<MidiEvent> midiEvents, int ticksPerMilisecond, Clock clock)
        {
            this.midiEvents = midiEvents;
            this.ticksPerMilisecond = ticksPerMilisecond;
            this.clock = clock;
        }

        public void Reset()
        {
            readerTicks = 0;
            currentLineIndex = 0;
        }
        
        public void ProvideBuffer(ref Queue<NoteOn> noteOnEvents, ref Queue<NoteOff> noteOffEvents)
        {
            var elapsedTime = clock.ElapsedTime;
            var elapsedTicks = elapsedTime.Milliseconds * ticksPerMilisecond;

            readerTicks += elapsedTicks;

            for (var i = currentLineIndex; i < midiEvents.Count; i++)
            {
                var midiEvent = midiEvents[i];
                if (midiEvent.AbsoluteTime > readerTicks)
                {
                    currentLineIndex = i;
                    return;
                }

                if (midiEvent is not NoteEvent noteEvent)
                {
                    continue;
                }

                switch (midiEvent.CommandCode)
                {
                    case MidiCommandCode.NoteOn:
                        var noteOn = noteEvent.ToNoteOn();
                        noteOnEvents.Enqueue(noteOn);
                        continue;

                    case MidiCommandCode.NoteOff:
                        var noteOff = noteEvent.ToNoteOff();
                        noteOffEvents.Enqueue(noteOff);
                        continue;

                    default:
                        continue;
                }
            }

            Reset();
        }
    }
}
