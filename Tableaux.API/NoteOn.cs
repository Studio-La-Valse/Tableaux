using StudioLaValse.ScoreDocument.Core;

namespace Tableaux.API
{
    public readonly struct NoteOn
    {
        public Pitch Pitch { get; }
        public int Amplitude { get; }

        public NoteOn(Pitch pitch, int amplitude)
        {
            Pitch = pitch;
            Amplitude = amplitude;
        }
    }
}
