using StudioLaValse.ScoreDocument.Core;
using System;

namespace Tableaux.API.Native.Engine
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
