using System.Collections.Generic;
using Tableaux.Models.Engine;
using Tableaux.Models.Signals;

namespace Tableaux.Models.Streams
{
    public class State
    {
        private readonly BaseState state;



        public Klavier Klavier { get; }
        public CircleOfFifths CircleOfFifths { get; }


        public FFTSignal? FFTSignal =>
            state is AudioStreamState audioStreamState ? audioStreamState.FFTSignal : null;
        public double Volume =>
            Klavier.MaxAmplitude;


        public State(BaseState state, Klavier klavier, CircleOfFifths circleOfFifths)
        {
            this.state = state;
            Klavier = klavier;
            CircleOfFifths = circleOfFifths;
        }



        public void FetchMissedMessages(out IEnumerable<Tone> notesOn, out IEnumerable<Tone> notesOff)
        {
            notesOn = [];
            notesOff = [];

            if (state is MidiStreamState midiFile)
            {
                notesOn = midiFile.MissedNotesOn;
                notesOff = midiFile.MissedNotesOff;
            }
        }
    }
}
