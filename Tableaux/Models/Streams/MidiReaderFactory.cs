using Microsoft.Extensions.Logging;
using NAudio.Midi;
using System.Linq;

namespace Tableaux.Models.Streams
{
    public class MidiReaderFactory
    {
        private readonly Clock clock;
        private readonly ILoggerFactory loggerFactory;

        public MidiReaderFactory(Clock clock, ILoggerFactory loggerFactory)
        {
            this.clock = clock;
            this.loggerFactory = loggerFactory;
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

        public MidiListener CreateListener(int deviceIndex)
        {
            var midiIn = new MidiIn(deviceIndex);
            var listener = new MidiListener(midiIn, loggerFactory.CreateLogger<MidiListener>());
            return listener;
        }
    }
}
