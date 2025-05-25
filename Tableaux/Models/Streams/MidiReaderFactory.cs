using NAudio.Midi;
using System.Linq;

namespace Tableaux.Models.Streams
{
    public class MidiReaderFactory
    {
        private readonly Clock clock;

        public MidiReaderFactory(Clock clock)
        {
            this.clock = clock;
        }

        public MidiReader CreateReader(string fileLocation)
        {
            var midiFile = new MidiFile(fileLocation, true);
            var midiEvents = midiFile.Events
                .Skip(1)
                .SelectMany(list => list)
                .OrderBy(midiEvent => midiEvent.AbsoluteTime)
                .ToList();

            var ticksPerQuarterNote = midiFile.Events.DeltaTicksPerQuarterNote;
            var milisecondsPerQuarterNote = midiFile.Events[0].OfType<TempoEvent>().Single().MicrosecondsPerQuarterNote / 1000d;
            var ticksPerMiliseconds = ticksPerQuarterNote / milisecondsPerQuarterNote;

            return new MidiReader(midiEvents, ticksPerQuarterNote, clock);
        }
    }
}
