using StudioLaValse.ScoreDocument.Core;

namespace Tableaux.API
{
    public readonly struct NoteOff
    {
        public Pitch Pitch { get; }

        public NoteOff(Pitch pitch)
        {
            Pitch = pitch;
        }
    }
}
