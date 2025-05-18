using NAudio.Midi;
using Tableaux.API.Native.Engine;
using Tableaux.API.Native.Utils;

namespace Tableaux.API.Native.Streams.Private
{
    public class MidiReaderInputStream : BaseMidiStream, IRenderStream
    {
        private readonly MidiFile _midiFile;
        private readonly IList<MidiEvent> _midiEvents;
        private readonly Queue<Tone> noteOnMessages;
        private readonly Queue<Tone> noteOffMessages;



        public string FileSource { get; }
        public double ReaderPosition { get; private set; }
        private int CurrentLineIndex { get; set; }
        private float[] FloatKeyValues { get; }
        public double StepSize { get; }
        public double ReaderLength { get; }


        public float FadingFactor =>
            0.995f;
        public override int[] KeyValues =>
            FloatKeyValues.Select(n => Convert.ToInt32(n)).ToArray();






        public MidiReaderInputStream(string fileName, double stepSize = 1000 / 29.97)
        {
            FileSource = fileName;

            var file = File.OpenRead(fileName);

            _midiFile = new MidiFile(file, false);

            _midiEvents = _midiFile.Events
                .SelectMany(list => list)
                .OrderBy(midiEvent => midiEvent.AbsoluteTime)
                .ToList();

            ReaderLength = _midiEvents.Count();

            FloatKeyValues = new float[88];

            Reset();

            StepSize = stepSize;

            noteOffMessages = new Queue<Tone>();
            noteOnMessages = new Queue<Tone>();
        }



        public void GetBuffer()
        {
            if (!IsStreaming)
            {
                return;
            }

            for (var i = CurrentLineIndex; i < ReaderLength; i++)
            {
                var midiEvent = _midiEvents[i];

                if (midiEvent.AbsoluteTime > ReaderPosition)
                {
                    CurrentLineIndex = i;

                    return;
                }

                if (!(midiEvent is NoteEvent noteEvent))
                {
                    continue;
                }

                switch (midiEvent.CommandCode)
                {
                    case MidiCommandCode.NoteOn:
                        FloatKeyValues[noteEvent.NoteNumber - 21] = noteEvent.Velocity;
                        noteOnMessages.Enqueue(new Tone((noteEvent.NoteNumber - 21).ToPitch(), noteEvent.Velocity));
                        continue;

                    case MidiCommandCode.NoteOff:
                        FloatKeyValues[noteEvent.NoteNumber - 21] = 0;
                        noteOffMessages.Enqueue(new Tone((noteEvent.NoteNumber - 21).ToPitch(), noteEvent.Velocity));
                        continue;

                    default:
                        continue;
                }
            }

            StopStream();
        }
        public bool MoveNext()
        {
            if (!IsStreaming)
            {
                return false;
            }

            ReaderPosition += StepSize;

            GetBuffer();

            return true;
        }
        public void Reset()
        {
            for (var i = 0; i < FloatKeyValues.Length; i++)
            {
                FloatKeyValues[i] = 0;
            }

            ReaderPosition = 0;

            CurrentLineIndex = 0;

            GetBuffer();
        }
        public override void StartStream()
        {
            base.StartStream();
        }
        public override void StopStream()
        {
            base.StopStream();
        }
        public override void MissedMessages(out List<Tone> notesOn, out List<Tone> notesOff)
        {
            notesOn = new List<Tone>();
            notesOff = new List<Tone>();

            while (noteOnMessages.Any())
            {
                notesOn.Add(noteOnMessages.Dequeue());
            }

            while (noteOffMessages.Any())
            {
                notesOff.Add(noteOffMessages.Dequeue());
            }
        }

        private bool disposedValue;
        protected virtual void Dispose(bool disposing)
        {
            if (!disposedValue)
            {
                if (disposing)
                {
                    StopStream();

                    // TODO: dispose managed state (managed objects)
                }

                // TODO: free unmanaged resources (unmanaged objects) and override finalizer
                // TODO: set large fields to null
                disposedValue = true;
            }
        }

        // // TODO: override finalizer only if 'Dispose(bool disposing)' has code to free unmanaged resources
        // ~SystemAudioInputStream()
        // {
        //     // Do not change this code. Put cleanup code in 'Dispose(bool disposing)' method
        //     Dispose(disposing: false);
        // }

        public override void Dispose()
        {
            // Do not change this code. Put cleanup code in 'Dispose(bool disposing)' method
            Dispose(disposing: true);
            GC.SuppressFinalize(this);
        }
    }
}
