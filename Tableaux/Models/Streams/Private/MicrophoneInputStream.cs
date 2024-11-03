using NAudio.Wave;
using System.Collections.Generic;
using Tableaux.Models.Signals;

namespace Tableaux.Models.Streams.Private
{
    public class MicrophoneInputStream : BaseMicrophoneInputStream
    {
        private readonly ISampleProvider _samples;
        private readonly BufferedWaveProvider _waveBuffer;
        private readonly WaveInEvent _waveInEvent;
        private readonly IList<float> _samplesInBuffer;
        private readonly int _bufferSize;



        public override int SampleRate =>
            _waveInEvent.WaveFormat.SampleRate;


        public MicrophoneInputStream(int deviceIndex, int sampleRate, int bitRate, int bufferMilliseconds, int bufferSize, IFastFourierTransformer fastFourier) : base(fastFourier)
        {
            _bufferSize = bufferSize;

            _waveInEvent = new WaveInEvent()
            {
                DeviceNumber = deviceIndex,
                WaveFormat = new WaveFormat(sampleRate, bitRate, 1),
                BufferMilliseconds = bufferMilliseconds,
            };

            _waveInEvent.DataAvailable += OnDataAvailable;

            _waveBuffer = new BufferedWaveProvider(_waveInEvent.WaveFormat)
            {
                DiscardOnBufferOverflow = true
            };

            _samples = _waveBuffer.ToSampleProvider();

            _samplesInBuffer = new List<float>();
        }

        private void OnDataAvailable(object? sender, WaveInEventArgs args)
        {
            _waveBuffer.AddSamples(args.Buffer, 0, args.Buffer.Length);
        }


        public override void StartStream()
        {
            base.StartStream();

            _waveInEvent.StartRecording();
        }
        public override void StopStream()
        {
            _waveInEvent.StopRecording();

            _waveBuffer.ClearBuffer();

            _samplesInBuffer.Clear();

            base.StopStream();
        }
        public override IList<float> GetBuffer()
        {
            var bytesPerSample = _waveBuffer.WaveFormat.BitsPerSample / 8;

            var samplesInBuffer = _waveBuffer.BufferedBytes / bytesPerSample;

            if (samplesInBuffer < 1)
            {
                return _samplesInBuffer;
            }

            var samples = new float[samplesInBuffer];

            _samples.Read(samples, 0, samples.Length);

            for (var i = 0; i < samples.Length; i++)
            {
                _samplesInBuffer.Add(samples[i]);

                while (_samplesInBuffer.Count > _bufferSize)
                {
                    _samplesInBuffer.RemoveAt(0);
                }
            }

            return _samplesInBuffer;
        }

    }
}
