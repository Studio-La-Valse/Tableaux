using FftSharp.Windows;
using System;
using System.Collections.Generic;
using System.Numerics;

namespace Tableaux.Models.Signals
{
    public interface IFastFourierTransformer
    {
        FFTSignal Transform(IList<float> signal, float sampleRate);
    }

    public class FastFourierSharpTransformer : IFastFourierTransformer
    {
        public FFTSignal Transform(IList<float> signal, float sampleRate)
        {
            if (signal.Count < 2)
            {
                return new FFTSignal([], [], []);
            }

            var fullLength = 2;

            //make sure the length of the array is a multiple of 2 and not greater than the original length
            while (fullLength * 2 <= signal.Count)
            {
                fullLength *= 2;
            }

            var trimmedSignal = new double[fullLength];
            var wind0w = new Hanning();
            var window = wind0w.Create(fullLength);
            var complexArray = new Complex[fullLength];
            var signalMax = double.MinValue;

            //apply a hanning window, fill the complex array and store the max value of the signal for normalization later
            for (var i = 0; i < fullLength; i++)
            {
                var adjustedValue = signal[i] * window[i];

                trimmedSignal[i] = adjustedValue;

                complexArray[i] = new Complex(adjustedValue, 0);

                if (adjustedValue > signalMax)
                {
                    signalMax = adjustedValue;
                }
            }

            FftSharp.FFT.Forward(complexArray);

            var fftSignal = new double[fullLength / 2];
            var fftMax = double.MinValue;

            //average the real and imaginary part of the complex array, store the max value for normalization later
            for (var i = 0; i < fftSignal.Length; i++)
            {
                var left = Math.Abs(complexArray[i].Real + complexArray[i].Imaginary);
                var right = Math.Abs(complexArray[fullLength - i - 1].Real + complexArray[fullLength - i - 1].Imaginary);
                var value = left + right;

                fftSignal[i] = value;

                if (value > fftMax)
                    fftMax = value;
            }

            //normalize the array, multiply with the original maxvalue of the signal so that the FFT and signal values share the same max
            if (fftMax != 0)
            {
                for (var i = 0; i < fftSignal.Length; i++)
                {
                    fftSignal[i] = fftSignal[i] / fftMax * signalMax;
                }
            }

            var fftFreqs = FftSharp.FFT.FrequencyScale(fftSignal.Length, sampleRate);
            return new FFTSignal(trimmedSignal, fftFreqs, fftSignal);
        }
    }
}
