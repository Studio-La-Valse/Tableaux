using NAudio.Wave;
using System.Collections.Generic;

namespace Tableaux.Models.Streams.Private
{
    internal class SampleAggregator : ISampleProvider
    {
        private readonly IList<float> samplesInBuffer;
        private readonly ISampleProvider source;
        private readonly int channels;

        public WaveFormat WaveFormat => source.WaveFormat;
        public int BufferSize { get; }


        public SampleAggregator(ISampleProvider source, int bufferSize)
        {
            BufferSize = bufferSize;

            channels = source.WaveFormat.Channels;

            this.source = source;

            samplesInBuffer = new List<float>();
        }

        public IList<float> GetBuffer()
        {
            return samplesInBuffer;
        }

        private void Add(float value)
        {
            samplesInBuffer.Add(value);

            while (samplesInBuffer.Count > BufferSize)
                samplesInBuffer.RemoveAt(0);
        }


        public int Read(float[] buffer, int offset, int count)
        {
            var samplesRead = source.Read(buffer, offset, count);

            for (var n = 0; n < samplesRead; n += channels)
            {
                Add(buffer[n + offset]);
            }
            return samplesRead;
        }

        public void Clean()
        {
            samplesInBuffer.Clear();
        }
    }
}
