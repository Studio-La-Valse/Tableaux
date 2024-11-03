using StudioLaValse.ScoreDocument.Core;
using System;

namespace Tableaux.Models.Engine
{
    public class KeyInKlavier : Tone
    {
        public double Loudness =>
            Amplitude / (double)MaxAmplitude;

        internal KeyInKlavier(Pitch pitch, double loudness) : base(pitch, (int)Math.Round(loudness * MaxAmplitude))
        {

        }
    }
}
