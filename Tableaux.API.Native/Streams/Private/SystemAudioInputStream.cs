using NAudio.CoreAudioApi;
using NAudio.Wave;
using System;
using System.Collections.Generic;
using Tableaux.API.Native.Signals;

namespace Tableaux.API.Native.Streams.Private
{
    public class SystemAudioInputStream : BaseSystemAudioInputStream
    {
        private readonly WasapiLoopbackCapture _waveIn;
        private readonly IList<float> _samplesInBuffer;
        private readonly int _bufferSize;


        public override int SampleRate => _waveIn.WaveFormat.SampleRate;



        public SystemAudioInputStream(IFastFourierTransformer fastFourierTransform, int deviceIndex = 1, int bufferSize = 16384) : base(fastFourierTransform)
        {
            var enumerator = new MMDeviceEnumerator();

            var devices = enumerator.EnumerateAudioEndPoints(DataFlow.Render, DeviceState.Active);

            var device = devices[deviceIndex];

            var client = device.AudioClient;

            _waveIn = new WasapiLoopbackCapture(device);

            _waveIn.DataAvailable += OnDataAvailable;

            _bufferSize = bufferSize;

            _samplesInBuffer = new List<float>();
        }


        public override void StartStream()
        {
            _waveIn.StartRecording();

            base.StartStream();
        }
        public override void StopStream()
        {
            _waveIn.StopRecording();

            _samplesInBuffer.Clear();

            base.StopStream();
        }
        public override IList<float> GetBuffer() => _samplesInBuffer;



        private void OnDataAvailable(object? sender, WaveInEventArgs e)
        {
            var buffer = e.Buffer;
            var bytesRecorded = e.BytesRecorded;
            var bufferIncrement = _waveIn.WaveFormat.BlockAlign;
            var numberChannels = _waveIn.WaveFormat.Channels;

            for (var index = 0; index < bytesRecorded; index += bufferIncrement)
            {
                var average = 0f;

                for (var j = 0; j < numberChannels; j++)
                {
                    var sample32 = BitConverter.ToSingle(buffer, index + j * 4);

                    average += sample32;
                }

                average /= numberChannels;

                _samplesInBuffer.Add(average);

                while (_samplesInBuffer.Count > _bufferSize)
                {
                    _samplesInBuffer.RemoveAt(0);
                }
            }
        }
    }
}
