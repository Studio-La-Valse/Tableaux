using NAudio.Wave;
using System;
using System.Collections.Generic;
using Tableaux.Models.Signals;

namespace Tableaux.Models.Streams.Private
{
    internal class AudioFileReaderInputSream : BaseAudioFilePlayerInputStream, IRenderStream
    {
        private readonly AudioFileReader _reader;
        private readonly int _windowSize;
        private double position;


        public double StepSize { get; }
        public string FileSource { get; }


        public override int SampleRate =>
            _reader.WaveFormat.SampleRate;
        public double ReaderPosition =>
            _reader.Position;
        public double ReaderLength =>
            _reader.Length;




        public AudioFileReaderInputSream(string fileName, IFastFourierTransformer fastFourierTransform, int windowSize = 16384, double stepSize = 1000 / 29.97) : base(fastFourierTransform)
        {
            FileSource = fileName;

            _reader = new AudioFileReader(fileName);
            _windowSize = windowSize;

            StepSize = stepSize;

            Reset();
        }



        public override IList<float> GetBuffer()
        {
            var numberOfChannels = _reader.WaveFormat.Channels;

            var buffer = new float[_windowSize * numberOfChannels];

            _reader.Read(buffer, 0, buffer.Length);

            for (var i = 0; i < buffer.Length; i += numberOfChannels)
            {
                var average = 0f;

                for (var j = 0; j < numberOfChannels; j++)
                {
                    var indexInBuffer = i + j;

                    average += buffer[indexInBuffer];
                }

                buffer[i] = average / numberOfChannels;
            }

            return buffer;
        }
        public bool MoveNext()
        {
            var bytesInWave = _reader.Length;

            var bytesPerMS = bytesInWave / _reader.TotalTime.TotalMilliseconds;

            _reader.Position = Convert.ToInt64(bytesPerMS * position);

            position += StepSize;

            if (position > _reader.TotalTime.TotalMilliseconds || _reader.Position > _reader.Length)
            {
                return false;
            }

            return true;
        }
        public void Reset()
        {
            position = 0;
        }
        public override void StartStream()
        {
            throw new NotImplementedException();
        }
        public override void StopStream()
        {
            throw new NotImplementedException();
        }
    }
}
