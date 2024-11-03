using System.Collections.Generic;
using System.Linq;
using Tableaux.Models.Engine;

namespace Tableaux.Models.Streams
{
    public class MidiStreamState : BaseState
    {
        private readonly int[] keyValues;
        public IEnumerable<Tone> MissedNotesOn { get; }
        public IEnumerable<Tone> MissedNotesOff { get; }

        public MidiStreamState(int[] keyValues, IEnumerable<Tone> missedNotesOn, IEnumerable<Tone> missedNotesOff)
        {
            this.keyValues = keyValues;
            MissedNotesOn = missedNotesOn;
            MissedNotesOff = missedNotesOff;
        }

        public override Klavier CreateKlavier()
        {
            return new Klavier(keyValues.Select(k => k / 127d).ToArray());
        }
    }
}
