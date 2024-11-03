using StudioLaValse.ScoreDocument.Core;

namespace Tableaux.Models.Engine
{
    public class Tone
    {
        public static readonly int MaxAmplitude = 127;
        public static readonly int MinAmplitude = 0;

        public Tone(Pitch step, int loudness)
        {
            Pitch = step;
            Amplitude = loudness;
        }

        public Pitch Pitch { get; }
        public int Amplitude { get; }
    }
}
