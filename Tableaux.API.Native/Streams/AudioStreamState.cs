﻿using System.Collections.Generic;
using Tableaux.API.Native.Engine;
using Tableaux.API.Native.Signals;

namespace Tableaux.API.Native.Streams
{
    public class AudioStreamState : BaseState
    {
        private readonly IFastFourierTransformer fastFourier;
        private readonly IList<float> buffer;
        private readonly int sampleRate;
        private FFTSignal? fftSignal;

        public AudioStreamState(IFastFourierTransformer fastFourier, IList<float> buffer, int sampleRate)
        {
            this.fastFourier = fastFourier;
            this.buffer = buffer;
            this.sampleRate = sampleRate;
        }

        public FFTSignal FFTSignal
        {
            get
            {
                return fftSignal ??= fastFourier.Transform(buffer, sampleRate);
            }
        }

        public sealed override Klavier CreateKlavier()
        {
            var klavier = new Klavier(FFTSignal);

            return klavier;
        }
    }
}
