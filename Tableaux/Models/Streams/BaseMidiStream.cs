//using System.Collections.Generic;
//using Tableaux.API.Engine;

//namespace Tableaux.Models.Streams
//{
//    public abstract class BaseMidiStream : BasePlaybackStream
//    {


//        public abstract int[] KeyValues { get; }

//        public BaseMidiStream()
//        {

//        }


//        public override BaseState GetState()
//        {
//            MissedMessages(out var notesOn, out var notesOff);

//            return new MidiStreamState(KeyValues, notesOn, notesOff);
//        }

//        public abstract void MissedMessages(out List<Tone> notesOn, out List<Tone> notesOff);
//    }
//}
