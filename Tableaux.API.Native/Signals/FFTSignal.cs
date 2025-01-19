using Tableaux.API.Native.Utils;

namespace Tableaux.API.Native.Signals
{
    public class FFTSignal
    {
        public double[] InputSignal { get; }
        public double[] Frequencies { get; }
        public double[] Values { get; }


        public FFTSignal(double[] inputSignal, double[] freqs, double[] values)
        {
            if (freqs.Length != values.Length)
            {
                throw new ArgumentOutOfRangeException(nameof(freqs));
            }

            InputSignal = inputSignal;
            Frequencies = freqs;
            Values = values;
        }


        public double ValueInterpolatedAtFrequency(double inputFrequency)
        {
            var value = 0d;

            for (var i = 0; i < Values.Length - 1; i++)
            {
                var valueAtI = Values[i];
                var frequencyAtI = Frequencies[i];
                var valueAtNext = Values[i + 1];
                var frequencyAtNext = Frequencies[i + 1];

                if (inputFrequency > frequencyAtI && inputFrequency <= frequencyAtNext)
                {
                    value = MathUtils.Map(inputFrequency, frequencyAtI, frequencyAtNext, valueAtI, valueAtNext);

                    break;
                }

            }

            return value;
        }

        public double ValueAtNearestFrequency(double inputFrequency)
        {
            return Values
                .Zip(Frequencies)
                .TakeWhile(v => v.Second < inputFrequency)
                .LastOrDefault().First;
        }
    }
}
