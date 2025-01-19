using Tableaux.API.Native.Signals;
using Tableaux.API.Native.Utils;

namespace Tableaux.API.Native.Engine
{
    public class Klavier
    {
        private readonly double[] amplitudes;


        public double MaxAmplitude => amplitudes.Max();
        public KeyInKlavier[] Keys
        {
            get
            {
                var keys = new KeyInKlavier[88];

                for (var i = 0; i < 88; i++)
                {
                    keys[i] = new KeyInKlavier(i.ToPitch(), amplitudes[i]);
                }

                return keys;
            }
        }
        public double Centroid { get; private set; }




        public Klavier(FFTSignal signal) : this(ToKeyValues(signal))
        {

        }
        public Klavier(double[] keyValues)
        {
            if (keyValues.Length != 88)
            {
                throw new Exception("Only an array with 88 items is valid for the klavier.");
            }

            amplitudes = keyValues;

            Centroid = CalculateSpectralCentroid();
        }
        public void Lerp(Klavier other, double parameter)
        {
            for (var i = 0; i < 88; i++)
            {
                var delta = other.Keys[i].Loudness - amplitudes[i];

                var newValue = amplitudes[i] + delta * parameter;

                amplitudes[i] = newValue;
            }

            Centroid = CalculateSpectralCentroid();
        }



        public static double[] ToKeyValues(FFTSignal fFTSignal)
        {
            var keys = new double[88];
            for (var i = 0; i < 88; i++)
            {
                var tone = new Tone(i.ToPitch(), 0);
                var frequencyAtKey = Convert.ToDouble(tone.Pitch.Frequency);
                var value = fFTSignal?.ValueAtNearestFrequency(frequencyAtKey) ?? 0;
                keys[i] = value;

                i++;
            }

            return keys;
        }
        private double CalculateSpectralCentroid()
        {
            var tempSpectrum = new double[88];

            for (var i = 0; i < 88; i++)
            {
                tempSpectrum[i] = 0;
            }

            if (MaxAmplitude > 0)
            {
                for (var i = 0; i < 88; i++)
                {
                    tempSpectrum[i] = amplitudes[i];
                    tempSpectrum[i] = MathUtils.Map(tempSpectrum[i], 0, MaxAmplitude, 0, 1);
                    tempSpectrum[i] = Math.Pow(tempSpectrum[i], 2);
                    tempSpectrum[i] *= MaxAmplitude;
                }
            }

            var centroid = 0d;

            var centroidSum = tempSpectrum.Sum();

            if (centroidSum > 0)
            {
                for (var i = 0; i < amplitudes.Length; i++)
                {
                    centroid += tempSpectrum[i] * i;
                }

                centroid = centroid / centroidSum / (amplitudes.Length - 1);
            }

            return centroid;
        }
    }
}
